using EPiServer;
using EPiServer.Applications;
using EPiServer.Core;
using EPiServer.Web;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace Alloy.ManagementSite
{
    /// <summary>
    /// Makes sure there is a routable application whose entry point is the Alloy start page and which has
    /// a host pointing at the headless delivery site. This replaces the site/host provisioning that
    /// <c>SiteDefinition</c> did before CMS 13.
    /// </summary>
    /// <remarks>
    /// This runs as a first request initializer rather than from an <c>IInitializableModule</c> because
    /// <c>App_Data/DefaultSiteContent.episerverdata</c> is imported on the first request, not at startup.
    /// At startup there is no start page yet on a database created by <c>setup.cmd</c>, so there would be
    /// nothing to point an application at. CMS registers its own initializer that imports the content and
    /// creates an application for the management site host; registering this one after
    /// <c>AddCmsHost()</c> makes it run afterwards, so it only has to replace that host with the
    /// delivery site one.
    /// </remarks>
    public class DeliveryApplicationInitializer : IBlockingFirstRequestInitializer
    {
        public bool CanRunInParallel => false;

        public async Task InitializeAsync(HttpContext httpContext)
        {
            var services = httpContext.RequestServices;
            var applicationRepository = services.GetRequiredService<IApplicationRepository>();
            var contentLoader = services.GetRequiredService<IContentLoader>();
            var configuration = services.GetRequiredService<IConfiguration>();
            var deliverySiteUrl = configuration["ManagementSite:DeliverySite:Url"] ?? "http://localhost:3000";

            var authority = new Uri(deliverySiteUrl).Authority;

            // The management site host has to be registered too. A request whose authority matches no host
            // falls back to the default application with ApplicationHost left null
            // (DefaultApplicationResolver.GetByHostnameInternal), and a null host means a null locale, which
            // is what makes urls without a language segment fail. It is a Default host, not the Primary one,
            // so that generated urls still point at the delivery site.
            var managementAuthority = httpContext.Request.Host.Value;

            var application = (await applicationRepository.ListAsync()).OfType<IRoutableApplication>().FirstOrDefault()
                ?? await CreateApplicationAsync(applicationRepository, contentLoader, authority);

            if (application is null)
            {
                return;
            }

            // The host needs a locale, otherwise a url without a language segment resolves to a null
            // requested language and the start page cannot be loaded. See LanguageUrlResolverPipelineStep:
            // RequestedLanguage falls back to the host locale when the url carries no language segment.
            var locale = GetMasterLanguage(contentLoader, application.EntryPoint);

            if (locale is not null)
            {
                var wanted = BuildHosts(authority, managementAuthority, locale);

                if (NeedsHostUpdate(application, wanted))
                {
                    var writableApplication = (Application)((Application)application).CreateWritableClone();
                    var hosts = ((IRoutableApplication)writableApplication).Hosts;

                    // Hosts are replaced rather than edited because ApplicationHost.Locale is init-only.
                    hosts.Clear();
                    foreach (var host in wanted)
                    {
                        hosts.Add(host);
                    }

                    await applicationRepository.SaveAsync(writableApplication);
                    application = (IRoutableApplication)writableApplication;
                }
            }

            // Without a default application the resolver cannot fall back when the request host does not
            // match any registered host, which is the case for calls coming from the delivery site.
            if (!application.IsDefault)
            {
                await applicationRepository.MakeDefaultAsync(application, true);
            }
        }

        private static List<ApplicationHost> BuildHosts(string deliveryAuthority, string managementAuthority, CultureInfo locale)
        {
            var hosts = new List<ApplicationHost>
            {
                new(deliveryAuthority) { Type = ApplicationHostType.Primary, Locale = locale }
            };

            if (!string.IsNullOrEmpty(managementAuthority) &&
                !string.Equals(managementAuthority, deliveryAuthority, StringComparison.OrdinalIgnoreCase))
            {
                // Default rather than Edit: ApplicationValidator rejects a locale on Edit, Preview and Media
                // hosts ("Media, Edit, and Preview hosts cannot be mapped to a locale."), and the locale is
                // the whole point of registering this host.
                hosts.Add(new ApplicationHost(managementAuthority) { Type = ApplicationHostType.Default, Locale = locale });
            }

            return hosts;
        }

        private static bool NeedsHostUpdate(IRoutableApplication application, List<ApplicationHost> wanted) =>
            !application.Hosts
                .Select(DescribeHost)
                .SequenceEqual(wanted.Select(DescribeHost), StringComparer.OrdinalIgnoreCase);

        private static string DescribeHost(ApplicationHost host) =>
            $"{host.Authority}({host.Type},{host.Locale?.Name ?? "-"})";

        private static CultureInfo GetMasterLanguage(IContentLoader contentLoader, ContentReference entryPoint) =>
            ContentReference.IsNullOrEmpty(entryPoint)
                ? null
                : (contentLoader.Get<IContent>(entryPoint) as ILocalizable)?.MasterLanguage;

        private static async Task<IRoutableApplication> CreateApplicationAsync(
            IApplicationRepository applicationRepository,
            IContentLoader contentLoader,
            string authority)
        {
            var startPage = contentLoader
                .GetChildren<PageData>(ContentReference.RootPage)
                .FirstOrDefault(page => page.ContentLink.ID != ContentReference.WasteBasket.ID);

            if (startPage is null)
            {
                return null;
            }

            // InProcessWebsite rather than Website: a headless Website only accepts Primary, Preview and
            // Media hosts, and BuildHosts also needs a Default host for the management site authority.
            var application = new InProcessWebsite(startPage.Name, startPage.ContentLink);
            application.Hosts.Add(new ApplicationHost(authority) { Type = ApplicationHostType.Primary });

            await applicationRepository.SaveAsync(application);

            return application;
        }
    }
}
