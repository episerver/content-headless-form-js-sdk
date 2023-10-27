export interface FormValidation
{
    elementKey: string
    results: FormValidationResult[]
}

export interface FormValidationResult {
    type: string
    valid: boolean
}