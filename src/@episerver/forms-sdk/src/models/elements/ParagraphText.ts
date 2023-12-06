import { ConditionProperties } from "../conditions/ConditionProperties";
import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase";
/**
 * Rich text (with placeholder)
 */
export interface ParagraphText extends FormElementBase {
    properties: ParagraphTextProperties
}

export interface ParagraphTextProperties extends FormElementPropertiesBase, ConditionProperties {
    paragraphText: string
    disablePlaceholdersReplacement: boolean
}