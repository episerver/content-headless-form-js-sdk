using System;
using EPiServer.Core;
using EPiServer.Framework.DataAnnotations;
using EPiServer.PlugIn;

namespace Alloy.ManagementSite.Models.Properties
{
    /// <summary>
    /// Property type for storing a list of strings
    /// </summary>
    /// <remarks>For an example, see <see cref="Alloy.ManagementSite.Models.Pages.SitePageData"/> where this property type is used for the MetaKeywords property</remarks>
    [PropertyDefinitionTypePlugIn(Description = "A property for list of strings", DisplayName = "String List")]
    public class PropertyStringList : PropertyLongString
    {
        protected string Separator { get; set; } = "\n";

        public string[] List => (string[])Value;

        public override Type PropertyValueType => typeof(string[]);

        public override object SaveData(PropertyDataCollection properties) => LongString;

        public override object Value
        {
            get => (base.Value is string value) ? value.Split(Separator.ToCharArray(), StringSplitOptions.RemoveEmptyEntries) : null;
            set => base.Value = value is string[] arrayValue ? string.Join(Separator, arrayValue) : value;
        }
    }
}
