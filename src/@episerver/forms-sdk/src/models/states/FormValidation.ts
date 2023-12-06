/**
 * Interface to define type of object that is form validation result 
 */
export interface FormValidationResult
{
    elementKey: string
    results: ElementValidationResult[]
}

/**
 * Interface to define type of object that is element validation result 
 */
export interface ElementValidationResult {
    type: string
    valid: boolean
}