import { HiddenElementBase, HiddenElementBaseProperties} from "./base";
/**
 * Collecting visitor data (ip, geo, browser ...) using a hidden input
 */
export interface VisitorDataHidden extends HiddenElementBase {
    properties: VisitorDataHiddenProperties
}

export interface VisitorDataHiddenProperties extends HiddenElementBaseProperties {

}