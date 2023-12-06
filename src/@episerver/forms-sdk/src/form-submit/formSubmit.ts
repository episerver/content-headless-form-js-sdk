import { FormStorage } from "../form-storage";
import { FormValidator } from "../form-validator";
import { equals } from "../helpers";
import { FormContainer, FormSubmission, FormValidationResult } from "../models";

/**
 * Class to submit form submission to Headless Form API
 */
export class FormSubmit {
    readonly _form: FormContainer

    constructor(form: FormContainer){
        this._form = form;
    }

    /**
     * Post an array of form submission to the Headless Form API
     * @param formSubmission the array of form submission to post
     */
    async doSubmit(formSubmissions: FormSubmission[]): Promise<any> {
        return new Promise<any>((resolve, reject)=>{
            let formStorage = new FormStorage(this._form);

            //save data to storage of browser
            formStorage.saveFormDataToStorage(formSubmissions);
    
            //TODO: post to API
        });
    }

    /**
     * Function to validate data before submit
     * @param formSubmission the array of form submission to post
     * @returns An array of validation result
     */
    doValidate(formSubmissions: FormSubmission[]): FormValidationResult[]{
        return this._form.formElements
            .filter(e => formSubmissions.some(fs => equals(fs.elementKey, e.key)))
            .map(e => {
                let formValidator = new FormValidator(e);
                let value = formSubmissions.filter(fs => equals(fs.elementKey, e.key))[0]?.value;
                return {
                    elementKey: e.key,
                    results: formValidator.validate(value)
                } as FormValidationResult;
        });
    }
}