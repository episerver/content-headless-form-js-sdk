import { FormContainer } from "../FormContainer"
import { FormSubmission } from "./FormSubmission"
import { FormValidation } from "./FormValidation"
import { StepDependencies } from "./StepDependencies"

export interface FormState {
    isReset: boolean
    formSubmissions: FormSubmission[]
    formValidations: FormValidation[]
    stepDependencies: StepDependencies[]
    formContainer: FormContainer
    dependencyInactiveElements: string[]
}