import {FormElementBase,FormElementPropertiesBase} from "./base/FormElementBase";
/**
 * Collecting visitor data (ip, geo, browser ...) using a hidden input
 */
export interface VisitorDataHidden extends FormElementBase {
    properties: VisitorDataHiddenProperties
}

export interface VisitorDataHiddenProperties extends FormElementPropertiesBase {

}