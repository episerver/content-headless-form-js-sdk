/** 
*   Base class for validators
*/
export interface ValidatorBase {
    type: string
    description: string
    model: ValidatorModelBase
}

export interface ValidatorModelBase {
    message: string
    validationCssClass: string
    additionalAttributes: any
}