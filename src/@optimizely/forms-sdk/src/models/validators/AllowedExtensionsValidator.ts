import { InternalElementValidatorBase } from "./base/InternalElementValidatorBase";
import { ValidatorModelBase } from "./base/ValidatorsBase";

export interface AllowedExtensionsValidator extends InternalElementValidatorBase{
    model: AllowedExtensionsValidatorModel
}

export interface AllowedExtensionsValidatorModel extends ValidatorModelBase {

}