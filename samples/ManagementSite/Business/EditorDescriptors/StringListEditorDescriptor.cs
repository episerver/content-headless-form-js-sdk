using EPiServer.Shell.ObjectEditing;
using EPiServer.Shell.ObjectEditing.EditorDescriptors;
using System;
using System.Collections.Generic;

namespace Alloy.ManagementSite.Business.EditorDescriptors
{
    [EditorDescriptorRegistration(TargetType = typeof(String[]))]
    public class StringListEditorDescriptor : EditorDescriptor
    {
        public override void ModifyMetadata(ExtendedMetadata metadata, IEnumerable<Attribute> attributes)
        {
            ClientEditingClass = "alloy/Editors/StringList";
            base.ModifyMetadata(metadata, attributes);
        }
    }
}
