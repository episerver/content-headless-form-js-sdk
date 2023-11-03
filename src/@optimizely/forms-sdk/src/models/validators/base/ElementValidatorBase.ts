export interface ElementValidatorBase {
    type: string
    validationOrder: number
    description: string
    model: ElementValidatorModelBase
}

export interface ElementValidatorModelBase {
    message: string
    validationCssClass: string
    additionalAttributes: any
}