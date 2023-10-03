namespace Alloy.ManagementSite
{
    public class ManagementSiteOptions
    {
        public DeliverySiteOptions DeliverySite { get; set; }
        public OpenIdConnectOptions OpenIdConnect { get; set; }
        public bool ConfigureDxp { get; set; }

        public class DeliverySiteOptions
        {
            public string Url { get; set; } = string.Empty;
        }
        public class OpenIdConnectOptions
        {
            public ContentDeliveryApiOptions ContentDeliveryApi { get; set; }
            public ContentDefinitionsApiOptions ContentDefinitionsApi { get; set; }

            public class ContentDeliveryApiOptions
            {
                public string ClientId { get; set; } = string.Empty;
            }
            public class ContentDefinitionsApiOptions
            {
                public string ClientId { get; set; } = string.Empty;
                public string ClientSecret { get; set; } = string.Empty;
            }
        }
    }
}
