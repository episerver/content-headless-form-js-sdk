import { FormContainer } from "../models/FormContainer";
import { FormSubmission } from "../models/states/FormSubmission";

export const FieldsToIgnore = [
    "FormStepBlock",
    "SubmitButtonElementBlock",
    "PredefinedHiddenElementBlock"
]

export function getValueAsString(element: FormSubmission) {
    let value = element.value ?? ""
    if (Array.isArray(value) && value.length > 0 &&
        value[0] !== null && typeof value[0] === "object") {
        let fileList = value
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
    return `${value}`
}

export function buildConfirmMessage(confirmationMessage: string, data: FormSubmission[], form: FormContainer, fieldsToIgnore?: string[]): string {
    const newLine = "\n"
    let message = confirmationMessage + newLine;
    let _fieldsToIgnore = fieldsToIgnore ?? FieldsToIgnore;
    data.forEach(element => {
        let formElement = form.formElements.find(fe => fe.key === element.elementKey)
        if (formElement && _fieldsToIgnore.indexOf(formElement.contentType) === -1) {
            message += `${formElement.displayName}: ${getValueAsString(element)}${newLine}`;
        }
    });

    return message
}