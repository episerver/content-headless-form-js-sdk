using EPiServer.Authorization;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Security;
using EPiServer.Logging;
using EPiServer.Shell.Security;
using System.Threading.Tasks;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using Microsoft.Extensions.DependencyInjection;

namespace Alloy.ManagementSite
{
    /// <summary>
    /// Provision the database for easier development by adding some default users.
    /// The delivery site application is provisioned by <see cref="DeliveryApplicationInitializer"/>,
    /// which has to run on the first request rather than at startup because the default site content
    /// is not imported until then.
    /// </summary>
    [InitializableModule]
    [ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
    public class ProvisionDatabase : IInitializableModule
    {
        private static readonly ILogger _logger = LogManager.GetLogger(typeof(ProvisionDatabase));
        private IContentSecurityRepository _contentSecurityRepository;
        private UIUserProvider _userProvider;
        private UIRoleProvider _roleProvider;

        public void Initialize(InitializationEngine context)
        {
            var services = context.Services;

            _contentSecurityRepository = services.GetRequiredService<IContentSecurityRepository>();
            _userProvider = services.GetRequiredService<UIUserProvider>();
            _roleProvider = services.GetRequiredService<UIRoleProvider>();

            AddUsersAndRolesAsync();
        }

        public void Uninitialize(InitializationEngine context)
        {
        }

        private async void AddUsersAndRolesAsync()
        {
            _logger.Information("Provisioning users and roles.");

            await AddRole(Roles.WebAdmins, AccessLevel.FullAccess);
            await AddRole(Roles.WebEditors, AccessLevel.FullAccess ^ AccessLevel.Administer);

            const string password = "sparr0wHawk!";
            await AddUser("cmsadmin", password, new[] { Roles.WebEditors, Roles.WebAdmins });
            await AddUser("abbie", password, new[] { Roles.WebEditors, Roles.WebAdmins });
            await AddUser("eddie", password, new[] { Roles.WebEditors });
            await AddUser("erin", password, new[] { Roles.WebEditors });
            await AddUser("reid", password, new[] { Roles.WebEditors });
        }

        private async Task AddUser(string userName, string password, params string[] roleNames)
        {
            _logger.Information($"Adding user {userName}.");

            if (await _userProvider.GetUserAsync(userName) is not null)
            {
                _logger.Information($"User {userName} already exists.");
                return;
            }

            var email = $"epic-{userName}@mailinator.com";
            await _userProvider.CreateUserAsync(userName, password, email, null, null, true);
            await _roleProvider.AddUserToRolesAsync(userName, roleNames);
        }

        private async Task AddRole(string roleName, AccessLevel accessLevel)
        {
            _logger.Information($"Adding role {roleName}.");

            if (await _roleProvider.RoleExistsAsync(roleName))
            {
                _logger.Information($"Role {roleName} already exists.");
                return;
            }

            await _roleProvider.CreateRoleAsync(roleName);

            var permissions = (IContentSecurityDescriptor)_contentSecurityRepository.Get(ContentReference.RootPage).CreateWritableClone();
            permissions.AddEntry(new AccessControlEntry(roleName, accessLevel));

            _contentSecurityRepository.Save(ContentReference.RootPage, permissions, SecuritySaveType.Replace);
            _contentSecurityRepository.Save(ContentReference.WasteBasket, permissions, SecuritySaveType.Replace);
        }
    }
}
