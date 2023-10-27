import { FormDependencies } from "./FormDependencies"
import { FormSubmission } from "./FormSubmission"
import { FormValidation } from "./FormValidation"
import { StepDependencies } from "./StepDependencies"

export interface FormState {
    formSubmissions: FormSubmission[]
    formValidations: FormValidation[]
    formDependencies: FormDependencies[]
    stepDependencies: StepDependencies[]
}