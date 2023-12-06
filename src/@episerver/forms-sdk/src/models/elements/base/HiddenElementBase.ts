import { DataElementBlockBase, DataElementBlockBaseProperties } from "./DataElementBase";

/**
 * Base class for all hidden form elements.
 * This element will not has description.
 * This element will not be shown in ViewMode (in summarized dialog, friendly name, ...)
 */
export interface HiddenElementBase extends DataElementBlockBase {

}

export interface HiddenElementBaseProperties extends DataElementBlockBaseProperties {

}
