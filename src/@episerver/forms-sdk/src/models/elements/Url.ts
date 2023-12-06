import { InputElementBase, InputElementBaseProperties } from "./base";
/**
 * Allows users to input and display a url
 */
export interface Url extends InputElementBase {
    properties:UrlProperties
}

export interface UrlProperties extends InputElementBaseProperties {
    urlValidators: string
}