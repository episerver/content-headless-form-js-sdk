using EPiServer.Cms.Shell;
using EPiServer.Cms.TinyMce;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.Cms.UI.Admin;
using EPiServer.Cms.UI.VisitorGroups;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.Core;
using EPiServer.DependencyInjection;
using EPiServer.Shell.Telemetry;
using EPiServer.Web.Mvc.Html;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Optimizely.Headless.Form.DependencyInjection;
using Optimizely.Headless.Form;

namespace Alloy.ManagementSite
{
    public class Startup
    {
        private readonly IWebHostEnvironment _environment;
        private readonly IConfiguration _configuration;
        private readonly string _allowedOrigins = "_allowedOrigins";

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

            services.Configure<TelemetryOptions>(o => {
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
                .ConfigureDxp(managementSiteOptions, _configuration);

            services.AddCors(opts => {
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

            // Register the Optimizely Headless Form API Services
            services.AddOptimizelyHeadlessFormService(options =>
            {
                options.EnableOpenApiDocumentation = true;
                options.FormCorsPolicy = new FormCorsPolicy
                {
                    AllowOrigins = new string[] { "http://localhost:3000" }, //Enter '*' to allow any origins, multiple origins separate by comma
                    AllowCredentials = true
                };
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
                endpoints.MapContent();
            });
        }
    }
}
