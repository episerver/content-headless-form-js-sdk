import { InternalElementValidatorBase, ElementValidatorModelBase } from "./base";

export interface AllowedExtensionsValidator extends InternalElementValidatorBase{
    model: AllowedExtensionsValidatorModel
}

export interface AllowedExtensionsValidatorModel extends ElementValidatorModelBase {
    accept: string
}