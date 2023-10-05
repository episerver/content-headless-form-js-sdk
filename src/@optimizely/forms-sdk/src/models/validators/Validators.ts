/** 
* Validator for validating input entered into the element
*/
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