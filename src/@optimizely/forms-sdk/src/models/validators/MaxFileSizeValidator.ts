import { InternalElementValidatorBase, ElementValidatorModelBase } from "./base";

export interface MaxFileSizeValidator extends InternalElementValidatorBase {
    model: MaxFileSizeValidationModel
}

export interface MaxFileSizeValidationModel extends ElementValidatorModelBase {
    sizeInBytes: number
}