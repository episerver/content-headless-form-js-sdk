import { FormElementBase } from "./elements/base/FormElementBase"

/**
 * Represent the Form and will be rendered as a hidden container
 */
export interface FormContainer {
    key : string
    properties : FormContainerProperties
    formElements : FormElementBase[]
    steps: Step[]
    localizations: Record<string, string>
}

export interface FormContainerProperties {
    title : string
    allowToStoreSubmissionData : boolean
    showSummarizedData : boolean
    confirmationMessage: string
    resetConfirmationMessage : string
    redirectToPage: string
    submitSuccessMessage: string
    allowAnonymousSubmission: boolean
    allowMultipleSubmission: boolean
    showNavigationBar : boolean
    description: string
    metadataAttribute: string
}

export interface Step {
    formStep: FormElementBase
    elements: FormElementBase[]
}