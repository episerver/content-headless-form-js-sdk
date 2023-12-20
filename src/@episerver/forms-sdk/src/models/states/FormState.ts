import { FormContainer } from "../FormContainer"
import { IdentityInfo } from "../IdentityInfo"
import { FormSubmission } from "./FormSubmission"
import { FormValidationResult } from "./FormValidation"
import { StepDependencies } from "./StepDependencies"

/**
 * Represent type of object that is form context
 */
export interface FormState {
    isReset: boolean
    formSubmissions: FormSubmission[]
    formValidationResults: FormValidationResult[]
    stepDependencies: StepDependencies[]
    formContainer: FormContainer
    dependencyInactiveElements: string[]
    focusOn: string,
    identityInfo?: IdentityInfo
    submissionKey?: string
    isSubmitting?: boolean
}