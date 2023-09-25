export interface Validators {
    type: string
    description: string
    model: ValidatorsModel
}

export interface ValidatorsModel {
    message: string
    validationCssClass: string
    additionalAttributes: any
}