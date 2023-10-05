import { ValidatableElementBase, ValidatableElementBaseProperties } from "./ValidatableElementBase"
/**
 * Base class for elements having semantic data (are data field of Form). 
 * These type of elements supports validating, field-mapping to other system.
 */
export interface DataElementBlockBase extends ValidatableElementBase {
    properties: DataElementBlockBaseProperties
}

export interface DataElementBlockBaseProperties extends ValidatableElementBaseProperties {
    predefinedValue: string
}