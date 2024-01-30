import { FormDependConditions } from "../form-depend-conditions";
import { ConditionProperties, FormElementBase, SatisfiedActionType } from "../models";
import { FormContainer } from "../models/FormContainer";
import { FormSubmission } from "../models/states/FormSubmission";
import { equals, isNull, isNullOrEmpty } from "./utils";

export const FieldsToIgnore = [
    "FormStepBlock",
    "SubmitButtonElementBlock",
    "PredefinedHiddenElementBlock",
    "ParagraphTextElementBlock"
]
/**
 * Get element value as string
 * @param element The form element submission
 * @returns 
 */
export function getStringValue(element: FormSubmission) {
    let value = element.value ?? ""
    if (Array.isArray(value) && value.length > 0 &&
        value[0] !== null && typeof value[0] === "object") {
        const fileList = value
        let fileNames = ""
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i].file
            fileNames += `${file.name}`
            if (fileList.length > 0) {
                fileNames += " | "
            }
        }
        return fileNames
    }
    return value
}
/**
 * Get element with elementKey that belong to a step that has index <= currentStepIndex
 * @param elementKey The form element key
 * @param form The form container
 * @param currentStepIndex The current form step index
 * @returns
 */
export function getValidStepsElement(elementKey: string, form: FormContainer, currentStepIndex: number): FormElementBase | null {
    let formElement = null
    for (let i = 0; i <= currentStepIndex; i++) {
        for (let element of form.steps[i].elements) {
            if (element.key == elementKey) {
                formElement = element
                break
            }
        }
    }
    return formElement
}
/**
 * Check if the element is visible or not
 * @param elementKey The form element key
 * @param form The form container
 * @returns
 */
export function checkElementIsVisible(formElement: FormElementBase, data: FormSubmission[]): boolean {
    const conditionProps = (formElement.properties as unknown) as ConditionProperties;
    if (isNull(conditionProps.satisfiedAction)) {
        return true;
    }
    const formDependConditions = new FormDependConditions(formElement)
    if (formDependConditions.checkConditions(data)) {
        return equals(conditionProps.satisfiedAction, SatisfiedActionType.Show);
    }
    else {
        return equals(conditionProps.satisfiedAction, SatisfiedActionType.Hide);
    }
}
/**
 * Get confirmation summary data from the start to the current step
 * @param data The current form data
 * @param form The form container
 * @param currentStepIndex The current form step index
 * @param inactiveElements The key of element that are inactive (hidden)
 * @param fieldsToIgnore Fields that you dont want to show up in the message
 * @returns
 */
export function getConfirmationData(data: FormSubmission[], form: FormContainer, currentStepIndex: number, inactiveElements: string[], fieldsToIgnore?: string[]): string {
    let message = "";
    const ignoreFields = fieldsToIgnore ?? FieldsToIgnore;
    data.forEach(elementData => {
        const formElement = getValidStepsElement(elementData.elementKey, form, currentStepIndex)
        const value = getStringValue(elementData)
        if (formElement
            && ignoreFields.indexOf(formElement.contentType) === -1
            && inactiveElements.indexOf(formElement.key) === -1
            && !isNullOrEmpty(value)
        ) {
            message += `${formElement.displayName}: ${value}${"\n"}`;
        }
    });
    return message
}