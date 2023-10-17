import { ValidatorBase } from "../../validators/base/ValidatorsBase";
import { FormElementBase, FormElementPropertiesBase } from "./FormElementBase";

/**
 * Base class for elements having semantic data (are data field of Form).
 * Elements can be applied with the validator.
 * Some validator types can be ignored.
 */
export interface ValidatableElementBase extends FormElementBase {
    properties: ValidatableElementBaseProperties
}

export interface ValidatableElementBaseProperties extends FormElementPropertiesBase {
    validators: ValidatorBase[]
    validatorMessages: string
}