using EPiServer.Authorization;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.Security;
using EPiServer.Logging;
using EPiServer.Shell.Security;
using EPiServer.Web;
using System.Linq;
using System.Threading.Tasks;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;

namespace Alloy.ManagementSite
{
    /// <summary>
    /// Provision the database for easier development by:
    ///  * Enabling project mode
    ///  * Adding some default users
    ///
    /// This file is preferably deployed in the App_Code folder, where it will be picked up and executed automatically.
    /// </summary>
    [InitializableModule]
    [ModuleDependency(typeof(EPiServer.Web.InitializationModule))]
    public class ProvisionDatabase : IInitializableModule
    {
        private static readonly ILogger _logger = LogManager.GetLogger(typeof(ProvisionDatabase));
        private ISiteDefinitionRepository _siteDefinitionRepository => ServiceLocator.Current.GetInstance<ISiteDefinitionRepository>();
        private IContentSecurityRepository _contentSecurityRepository => ServiceLocator.Current.GetInstance<IContentSecurityRepository>();
        private UIUserProvider _userProvider => ServiceLocator.Current.GetInstance<UIUserProvider>();
        private UIRoleProvider _roleProvider => ServiceLocator.Current.GetInstance<UIRoleProvider>();

        public void Initialize(InitializationEngine context)
        {
            AddUsersAndRolesAsync();
            ServiceLocator.Current.GetInstance<ISiteDefinitionEvents>().SiteCreated += ProvisionDatabase_SiteCreated;
        }

        public void Uninitialize(InitializationEngine context)
        {
            ServiceLocator.Current.GetInstance<ISiteDefinitionEvents>().SiteCreated -= ProvisionDatabase_SiteCreated;
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

        private void ProvisionDatabase_SiteCreated(object sender, SiteDefinitionEventArgs e)
        {
            _logger.Information("Provisioning primary site host.");

            var site = _siteDefinitionRepository
                .List()
                .FirstOrDefault();

            if (site is null)
            {
                _logger.Information("Primary site host already exists.");

                return;
            }
            else
            {
                site = site.CreateWritableClone();
            }

            if (!site.Hosts.Any(x => x.Type == HostDefinitionType.Primary))
            {
                var editHost = site.Hosts.First(x => x.Name != "*");
                editHost.Type = HostDefinitionType.Edit;

                site.Hosts.Add(new HostDefinition
                {
                    Type = HostDefinitionType.Primary,
                    Name = "localhost:3000"
                });
            }

            _siteDefinitionRepository.Save(site);
        }
    }
}
