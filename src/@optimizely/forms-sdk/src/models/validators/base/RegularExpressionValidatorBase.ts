import { ElementValidatorBase } from "./ElementValidatorBase";
import { ValidatorModelBase } from "./ValidatorsBase";

export interface RegularExpressionValidatorBase extends ElementValidatorBase{
    model: RegularExpressionValidatorModel
}

export interface RegularExpressionValidatorModel extends ValidatorModelBase {
    jsPattern: string,
    dotNetPattern: string
}