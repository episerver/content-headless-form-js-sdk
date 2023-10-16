import {InputElementBase, InputElementBaseProperties} from "./base";
/**
 * Allows users to input and display multiple lines of text within a defined area.
 */
export interface Textarea extends InputElementBase {
    properties: TextareaProperties
}

export interface TextareaProperties extends InputElementBaseProperties{
    forms_ExternalSystemsFieldMappings: string[];
    autoComplete: string;
}
