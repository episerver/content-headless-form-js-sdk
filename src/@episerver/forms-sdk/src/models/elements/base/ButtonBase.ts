import { FormElementBase, FormElementPropertiesBase } from "./FormElementBase";

/**
 * Base for all button type elements
 */
export interface ButtonBase extends FormElementBase {
    properties: ButtonBaseProperties
}

export interface ButtonBaseProperties extends FormElementPropertiesBase {

}
