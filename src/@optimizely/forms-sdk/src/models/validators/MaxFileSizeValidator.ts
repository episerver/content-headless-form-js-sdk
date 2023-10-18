import { InternalElementValidatorBase, ValidatorModelBase } from "./base";

export interface MaxFileSizeValidator extends InternalElementValidatorBase {
    model: MaxFileSizeValidationModel
}

export interface MaxFileSizeValidationModel extends ValidatorModelBase {
    sizeInBytes: number
}