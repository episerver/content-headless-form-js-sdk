/**
 * Represent type of object that is form validation result 
 */
export interface FormValidationResult
{
    elementKey: string;
    result: ElementValidationResult;
}

export interface ElementValidationResult {
    valid: boolean;
    message: string;
}