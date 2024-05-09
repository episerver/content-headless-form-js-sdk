using System.Runtime.InteropServices;
using EPiServer.Cms.Shell;
using EPiServer.Cms.UI.AspNetIdentity;
using EPiServer.ContentApi.Cms;
using EPiServer.ContentApi.Core.DependencyInjection;
using EPiServer.ContentDefinitionsApi;
using EPiServer.Core;
using EPiServer.Data;
using EPiServer.DependencyInjection;
using EPiServer.OpenIDConnect;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using OpenIddict.Server;
using Optimizely.Headless.Form;
using Optimizely.Headless.Form.DependencyInjection;
using Optimizely.Cms.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;
using System.Text;
using System.Text.Unicode;
using Microsoft.IdentityModel.Logging;

// using Optimizely.ContentGraph.Cms.NetCore.ProxyUtils;

namespace MusicFestival.Backend;

public class Startup
{
    private readonly IWebHostEnvironment _webHostingEnvironment;
    private readonly string _frontendUri;
    private readonly IConfiguration _configuration;
    private readonly string SecretKey = "6e13c68325f0379c2a6b1277e4eb9b97";

    public Startup(IWebHostEnvironment webHostingEnvironment, IConfiguration configuration)
    {
        _webHostingEnvironment = webHostingEnvironment;
        _configuration = configuration;
        _frontendUri = _configuration["FRONT_END_URI"];
    }

    public void ConfigureServices(IServiceCollection services)
    {
        var isMacOs = RuntimeInformation.IsOSPlatform(OSPlatform.OSX);
        var localDBPath = Path.Combine(_webHostingEnvironment.ContentRootPath, "App_Data\\musicfestival.mdf");
        var localDBConnString = $@"Data Source=(LocalDb)\MSSQLLocalDB;AttachDbFilename={localDBPath};
                                    Integrated Security=True;Encrypt=False;
                                    Connect Timeout=30;MultipleActiveResultSets=True";
        var macOsConnString = @"Data Source=localhost,1433;Initial Catalog=musicfestival;
                                User=sa;Password=Admin123!;
                                Trust Server Certificate=True;Connect Timeout=30";
        var connectionstring = _configuration.GetConnectionString("EPiServerDB")
                                ?? (isMacOs ? macOsConnString : localDBConnString);
        services.Configure<DataAccessOptions>(o =>
        {
            o.SetConnectionString(connectionstring);
        });
        IdentityModelEventSource.ShowPII = true;
        AppDomain.CurrentDomain.SetData("DataDirectory", Path.Combine(_webHostingEnvironment.ContentRootPath, "App_Data"));

        services
            .AddCmsAspNetIdentity<ApplicationUser>()
            .AddCms()
            .AddAdminUserRegistration(o => {
                o.Behavior = EPiServer.Cms.Shell.UI.RegisterAdminUserBehaviors.Enabled | EPiServer.Cms.Shell.UI.RegisterAdminUserBehaviors.LocalRequestsOnly;
            })
            .AddEmbeddedLocalization<Program>()
            .ConfigureForExternalTemplates()
            .Configure<ExternalApplicationOptions>(options => options.OptimizeForDelivery = true)
            .Configure<DisplayOptions>(options =>
            {
                options
                    .Add("full", "Full", "u-md-sizeFull", string.Empty, "epi-icon__layout--full")
                    .Add("wide", "Wide", "u-md-size2of3", string.Empty, "epi -icon__layout--two-thirds")
                    .Add("half", "Half", "u-md-size1of2", string.Empty, "epi-icon__layout--half")
                    .Add("narrow", "Narrow", "u-md-size1of3", string.Empty, "epi-icon__layout--one-third");
            });

        services.AddOpenIDConnectUI();

        // No encrypt the token so it's easier to debug, not recommend for production.
        services.AddOpenIddict()
            .AddServer(options => options.DisableAccessTokenEncryption());

        services.AddContentDefinitionsApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);

        services.AddContentDeliveryApi(OpenIDConnectOptionsDefaults.AuthenticationScheme);

        services.AddContentManagementApi(OpenIDConnectOptionsDefaults.AuthenticationScheme, options =>
        {
            options.DisableScopeValidation = false;
            options.RequiredRole = "WebAdmins";
        });
        // services.AddContentManagementApi(string.Empty);

        services.ConfigureForContentDeliveryClient();

        services.ConfigureContentApiOptions(o =>
        {
            o.FlattenPropertyModel = true;
            o.EnablePreviewFeatures = true;
            o.SetValidateTemplateForContentUrl(true);
            o.IncludeSiteHosts = true;
            o.IncludeInternalContentRoots = true;
            o.IncludeNumericContentIdentifier = true;
        });

        var clientJWTProvider = new OpenIDConnectClient();

        //clientJWTProvider.EncryptionKeys.Add(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(SecretKey)));

        // Register the Optimizely Headless Form API Services
        services.AddOptimizelyHeadlessFormService(options =>
        {
            options.EnableOpenApiDocumentation = true;
            options.FormCorsPolicy = new FormCorsPolicy
            {
                AllowOrigins = new string[] { _frontendUri }, //Enter '*' to allow any origins, multiple origins separate by comma
                AllowCredentials = true
            };
            options.OpenIDConnectClients.Add(clientJWTProvider);
        });

        services.AddContentGraph(OpenIDConnectOptionsDefaults.AuthenticationScheme);
        services.AddHostedService<ProvisionDatabase>();

        services.AddOptimizelyCmsContentOnEPiServerPreview1();

        services.AddOptimizelyHeadlessFormContentGraph();
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
        }

        app.UseStaticFiles();
        app.UseRouting();
        app.UseCors(b => b
            .WithOrigins(new[] { $"{_frontendUri}", "*" })
            .WithExposedContentDeliveryApiHeaders()
            .WithExposedContentDefinitionApiHeaders()
            .WithHeaders("Authorization")
            .AllowAnyMethod()
            .AllowCredentials());

        app.UseAuthentication();
        app.UseAuthorization();

        app.Use(async (context, next) => {
            context.Request.EnableBuffering();
            await next.Invoke();
        });

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
            endpoints.MapContent();
        });

        app.UseStatusCodePages(context =>
        {
            if (context.HttpContext.Response.HasStarted == false &&
                context.HttpContext.Response.StatusCode == StatusCodes.Status404NotFound &&
                context.HttpContext.Request.Path == "/")
            {
                context.HttpContext.Response.Redirect("/episerver/cms");
            }

            return Task.CompletedTask;
        });
    }
}
