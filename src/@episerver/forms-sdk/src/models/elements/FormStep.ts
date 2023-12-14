import { FormElementBase, FormElementPropertiesBase } from "./base/FormElementBase"
/**
 * Indicate a form step has ended
 */
export interface FormStep extends FormElementBase {
    properties: FormStepProperties
}

export interface FormStepProperties extends FormElementPropertiesBase {
    attachedContentLink: string
    dependField: DependField
    dependCondition: string
    dependValue: string
}

export interface DependField {
    key: string
    locale: string
    version: number
}