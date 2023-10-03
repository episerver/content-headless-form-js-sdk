using System;
using System.IO;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Data;
using EPiServer.OpenIDConnect;
using EPiServer.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace Alloy.ManagementSite
{
    public static class Configuration
    {
        public static IServiceCollection ConfigureDataAccess(this IServiceCollection services, IConfiguration configuration, string contentRootPath)
        {
            var dbPath = Path.Combine(contentRootPath, "App_Data\\Alloy.mdf");
            var connectionstring = configuration.GetConnectionString("EPiServerDB") ?? $"Data Source=(LocalDb)\\MSSQLLocalDB;AttachDbFilename={dbPath};Initial Catalog=alloy_ndc_netcore;Integrated Security=True;Connect Timeout=30;MultipleActiveResultSets=True";

            services.Configure<DataAccessOptions>(options =>
            {
                options.SetConnectionString(connectionstring);
            });

            return services;
        }

        public static IServiceCollection ConfigureDisplayOptions(this IServiceCollection services)
        {
            services.Configure<DisplayOptions>(options =>
            {
                options
                    .Add("full", "Full", "u-md-sizeFull", string.Empty, "epi-icon__layout--full")
                    .Add("wide", "Wide", "u-md-size2of3", string.Empty, "epi -icon__layout--two-thirds")
                    .Add("half", "Half", "u-md-size1of2", string.Empty, "epi-icon__layout--half")
                    .Add("narrow", "Narrow", "u-md-size1of3", string.Empty, "epi-icon__layout--one-third");
            });

            return services;
        }

        public static IServiceCollection AddContentDelivery(this IServiceCollection services, ManagementSiteOptions managementSiteOptions)
        {
            services.AddOpenIDConnect<ApplicationUser>(
                useDevelopmentCertificate: true,
                signingCertificate: null,
                encryptionCertificate: null,
                createSchema: true,
                options =>
                {
                    options.RequireHttps = false; // Do not use in production

                    options.Applications.Add(new OpenIDConnectApplication
                    {
                        ClientId = managementSiteOptions.OpenIdConnect.ContentDeliveryApi.ClientId,
                        Scopes = { "openid", "offline_access", "profile", "email", "roles", ContentDeliveryApiOptionsDefaults.Scope },
                        PostLogoutRedirectUris = { new Uri(managementSiteOptions.DeliverySite.Url) },
                        RedirectUris =
                        {
                            new Uri(new Uri(managementSiteOptions.DeliverySite.Url), "/signin-oidc"),
                            new Uri(new Uri(managementSiteOptions.DeliverySite.Url), "/signout-oidc"),
                        },
                    }); ;

                    options.Applications.Add(new OpenIDConnectApplication
                    {
                        ClientId = managementSiteOptions.OpenIdConnect.ContentDefinitionsApi.ClientId,
                        ClientSecret = managementSiteOptions.OpenIdConnect.ContentDefinitionsApi.ClientSecret,
                        Scopes = { ContentDefinitionsApiOptionsDefaults.Scope },
                    });
                });

            services.AddContentDefinitionsApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);
            services.AddContentDeliveryApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);
            services.ConfigureForContentDeliveryClient();

            // Temporary fix that will be removed when a new version of EPiServer.ContentApi.Core is released.
            // In order for authenticat/authorization to work cross domain we need to run in SameSiteMode.None and in Secure mode.
            services.Configure<CookiePolicyOptions>(opt => {
                opt.OnAppendCookie = ctx =>
                {
                    ctx.CookieOptions.SameSite = Microsoft.AspNetCore.Http.SameSiteMode.None;
                    ctx.CookieOptions.Secure = true;
                };
            });

            return services;
        }

        public static IServiceCollection ConfigureDxp(this IServiceCollection services, ManagementSiteOptions managementSiteOptions, IConfiguration configuration)
        {
            if (managementSiteOptions.ConfigureDxp)
            {
                services.AddCmsCloudPlatformSupport(configuration);
            }

            return services;
        }
    }
}
