import { FormContainer } from "../models/FormContainer";
import { FormSubmission } from "../models/states/FormSubmission";
import { isNullOrEmpty } from "./utils";

export const FieldsToIgnore = [
    "FormStepBlock",
    "SubmitButtonElementBlock",
    "PredefinedHiddenElementBlock"
]

export function getValueAsString(element: FormSubmission) {
    let value = element.value ?? ""
    if (Object.getPrototypeOf(value) === FileList.prototype) {
        let fileList = value as FileList
        let fileNames = ""
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i]
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
        let value = getValueAsString(element);
        if (formElement && _fieldsToIgnore.indexOf(formElement.contentType) === -1 && !isNullOrEmpty(value)) {
            message += `${formElement.displayName}: ${value}${newLine}`;
        }
    });

    return message
}