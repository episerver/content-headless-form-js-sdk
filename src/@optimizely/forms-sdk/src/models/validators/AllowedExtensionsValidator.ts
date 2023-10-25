import { InternalElementValidatorBase, ValidatorModelBase } from "./base";

export interface AllowedExtensionsValidator extends InternalElementValidatorBase{
    model: AllowedExtensionsValidatorModel
}

export interface AllowedExtensionsValidatorModel extends ValidatorModelBase {
    accept: string
}