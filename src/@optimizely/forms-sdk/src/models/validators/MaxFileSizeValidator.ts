import { InternalElementValidatorBase } from "./base/InternalElementValidatorBase";
import { ValidatorModelBase } from "./base/ValidatorsBase";

export interface MaxFileSizeValidator extends InternalElementValidatorBase {
    model: MaxFileSizeValidationModel
}

export interface MaxFileSizeValidationModel extends ValidatorModelBase {
    sizeInBytes: number
}