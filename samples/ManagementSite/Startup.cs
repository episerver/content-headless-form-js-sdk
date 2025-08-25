using EPiServer.Cms.Shell;
using EPiServer.Cms.TinyMce;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Cms.UI.Admin;
using EPiServer.Cms.UI.VisitorGroups;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.Core;
using EPiServer.Shell.Telemetry;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using EPiServer.OpenIDConnect;
using System;
using static OpenIddict.Abstractions.OpenIddictConstants;
using Microsoft.Extensions.Options;
using OpenIddict.Server;
using System.Linq;
using Microsoft.Extensions.DependencyInjection.Extensions;
using EPiServer.DependencyInjection;
using Optimizely.Cms.Forms.DependencyInjection;
using Optimizely.Cms.Forms;
using EPiServer.Cms.Shell.UI;

namespace Alloy.ManagementSite
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly string _allowedOrigins = "_allowedOrigins";
        private const string TestClientId = "TestClient";
        private const string TestClientSecret = "TestClientSecret";
        private const string ClientEndpoint = "https://localhost:8082";

        public Startup(IWebHostEnvironment environment, IConfiguration configuration)
        {
            _environment = environment;
            _configuration = configuration;
        }

        public void ConfigureServices(IServiceCollection services)
        {
            if (_environment.IsDevelopment())
            {
                //NETCORE: Consider add appsettings support for this
                services.Configure<StaticFileOptions>(o =>
                {
                    o.OnPrepareResponse = context =>
                    {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store");
                        context.Context.Response.Headers.Add("Expires", "-1");
                    };
                });
            }

            services.Configure<TelemetryOptions>(o =>
            {
                o.Enabled = false;
            });

            services.AddCmsAspNetIdentity<ApplicationUser>(configureIdentity: options =>
            {
                // Use sane passwords
                options.Password.RequireDigit = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequiredUniqueChars = 0;
                options.Password.RequiredLength = 3; // Do not use in production
            });

            var managementSiteOptions = _configuration.GetSection("ManagementSite").Get<ManagementSiteOptions>();

            services
                .AddCmsHost()
                .AddCmsHtmlHelpers()
                .AddCmsUI()
                .AddAdmin()
                .AddTinyMce()
                .AddVisitorGroupsUI()
                .AddEmbeddedLocalization<Startup>()
                .ConfigureForExternalTemplates()
                .ConfigureDataAccess(_configuration, _environment.ContentRootPath)
                .Configure<ExternalApplicationOptions>(options => options.OptimizeForDelivery = true)
                .ConfigureDisplayOptions()
                .AddContentDelivery(managementSiteOptions)
                .ConfigureDxp(managementSiteOptions, _configuration)
                .AddAdminUserRegistration(options => options.Behavior = RegisterAdminUserBehaviors.Enabled |
                                                                    RegisterAdminUserBehaviors.LocalRequestsOnly);

            services.AddCors(opts =>
            {
                opts.AddPolicy(name: _allowedOrigins, builder =>
                {
                    builder.WithOrigins(managementSiteOptions.DeliverySite.Url)
                    .WithExposedContentDeliveryApiHeaders()
                    .WithExposedContentDefinitionApiHeaders()
                    .WithHeaders("Authorization")
                    .AllowAnyMethod()
                    .AllowCredentials();
                });
            });

            services.AddOpenIDConnect<ApplicationUser>(
               useDevelopmentCertificate: true,
               signingCertificate: null,
               encryptionCertificate: null,
               createSchema: true,
               options =>
               {
                   options.AllowResourceOwnerPasswordFlow = true;
                   options.AccessTokenLifetime = TimeSpan.FromHours(24);
                   options.RequireHttps = false;
                   options.Applications.Add(new OpenIDConnectApplication
                   {
                       ClientId = TestClientId,
                       Scopes =
                       {
                            Scopes.OpenId,
                       },
                   });
               });

            services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<OptimizelyFormsServiceOptions>, HeadlessFormServiceOptionsPostConfigure>());

            // Register the Optimizely Headless Form API Services
            services.AddOptimizelyFormsService(options =>
            {
                options.EnableOpenApiDocumentation = true;
                options.FormCorsPolicy = new FormCorsPolicy
                {
                    AllowOrigins = new string[] { "*" }, //Enter '*' to allow any origins, multiple origins separate by comma
                    AllowCredentials = true
                };
                options.OpenIDConnectClients.Add(new()
                {
                    Authority = ClientEndpoint
                });
            });

            services.AddContentGraph(OpenIDConnectOptionsDefaults.AuthenticationScheme);

            //Register ContentGraph for HeadlessForm
            services.AddContentDeliveryApi(op =>
            {
                op.DisableScopeValidation = true;
                op.RequiredRole = null;
            });
            services.ConfigureContentApiOptions(o =>
            {
                o.FlattenPropertyModel = true;
                o.IncludeNumericContentIdentifier = true;
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles();
            app.UseRouting();
            app.UseCors(_allowedOrigins);
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapContent();
            });
        }
    }

    public class HeadlessFormServiceOptionsPostConfigure : IPostConfigureOptions<OptimizelyFormsServiceOptions>
    {
        private readonly OpenIddictServerOptions _options;

        public HeadlessFormServiceOptionsPostConfigure(IOptions<OpenIddictServerOptions> options)
        {
            _options = options.Value;
        }

        public void PostConfigure(string name, OptimizelyFormsServiceOptions options)
        {
            foreach (var client in options.OpenIDConnectClients)
            {
                foreach (var key in _options.EncryptionCredentials.Select(c => c.Key))
                {
                    client.EncryptionKeys.Add(key);
                }
            }

            foreach (var client in options.OpenIDConnectClients)
            {
                foreach (var key in _options.SigningCredentials.Select(c => c.Key))
                {
                    client.SigningKeys.Add(key);
                }
            }
        }
    }
}
