import { FormContainer } from "../FormContainer"
import { FormDependencies } from "./FormDependencies"
import { FormSubmission } from "./FormSubmission"
import { FormValidation } from "./FormValidation"
import { StepDependencies } from "./StepDependencies"

export interface FormState {
    isReset: boolean
    formSubmissions: FormSubmission[]
    formValidations: FormValidation[]
    formDependencies: FormDependencies[]
    stepDependencies: StepDependencies[]
    formContainer: FormContainer
}