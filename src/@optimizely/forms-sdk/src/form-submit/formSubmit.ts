import { FormStorage } from "../form-storage";
import { FormContainer, FormSubmission } from "../models";

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
}