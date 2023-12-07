import { FormContainer } from "../FormContainer"
import { FormSubmission } from "./FormSubmission"
import { FormValidationResult } from "./FormValidation"
import { StepDependencies } from "./StepDependencies"

/**
 * Interface to define type of object that is form context
 */
export interface FormState {
    isReset: boolean
    formSubmissions: FormSubmission[]
    formValidationResults: FormValidationResult[]
    stepDependencies: StepDependencies[]
    formContainer: FormContainer
    dependencyInactiveElements: string[]
    focusOn: string
}