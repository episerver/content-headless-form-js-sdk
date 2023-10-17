import { InputElementBaseProperties, InputElementBase } from "./base";
/**
 * Only allows users to input numeric values
 */
export interface Number extends InputElementBase {
    properties: NumberProperties
}

export interface NumberProperties extends InputElementBaseProperties {
    autoComplete: string;
}