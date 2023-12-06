/**
 * Base class for all elements of Forms
 */
export interface FormElementBase {
    key: string
    contentType: string
    displayName: string
    properties: FormElementPropertiesBase
    localizations: Record<string, string>
    locale: string
}

export interface FormElementPropertiesBase {
    description: string
    label: string
}