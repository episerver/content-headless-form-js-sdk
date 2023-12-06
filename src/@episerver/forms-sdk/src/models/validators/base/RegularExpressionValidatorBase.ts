import { ElementValidatorBase, ElementValidatorModelBase } from "./ElementValidatorBase";

export interface RegularExpressionValidatorBase extends ElementValidatorBase{
    model: RegularExpressionValidatorModel
}

export interface RegularExpressionValidatorModel extends ElementValidatorModelBase {
    jsPattern: string,
    dotNetPattern: string
}