import { InputElementBase, InputElementBaseProperties } from "./base"
/**
 * Allows users to input and display a single line of text
 */
export interface Textbox extends InputElementBase {
    properties: TextboxProperties
}

export interface TextboxProperties extends InputElementBaseProperties {
    autoComplete: string
}