import { HiddenElementBase, HiddenElementBaseProperties } from "./base/HiddenElementBase";

/**
 * Hidden with predefined value
 * Acts like a tag to the SubmissionData
 */
export interface PredefinedHidden extends HiddenElementBase {
    properties: PredefinedHiddenProperties
}

export interface PredefinedHiddenProperties extends HiddenElementBaseProperties{

}