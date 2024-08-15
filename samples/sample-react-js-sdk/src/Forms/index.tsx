import { FormContainer, Selection, FormStorage, FormSubmission, FormSubmitModel, FormSubmitResult, FormSubmitter, FormValidationResult, ProblemDetail, Textbox, Number, Url, Textarea, SubmitButton, ResetButton, FormElementBase } from '@episerver/forms-sdk';
import React, { useEffect, useState } from 'react';
import TextBoxElementBlock from './Elements/TextBoxElementBlock';
import NumberElementBlock from './Elements/NumberElementBlock';
import UrlElementBlock from './Elements/UrlElementBlock';
import TextareaElementBlock from './Elements/TextareaElementBlock';
import SelectionElementBlock from './Elements/SelectionElementBlock';
import SubmitButtonElementBlock from './Elements/SubmitButtonElementBlock';
import ResetButtonElementBlock from './Elements/ResetButtonElementBlock';


interface Props {
    formData: FormContainer;
}

const FormComponent: React.FC<Props> = ({ formData }) => {
    const [form, setFormData] = useState<FormContainer | null>(null);
    const [submited, setsubmited] = useState(false);
    const [errorMessage, seterrorMessage] = useState('');
    /**
     * You can store these two in states like this or use formStorage from the sdk
     */
    const [validateResult, setValidateResult] = useState<FormValidationResult[]>([])
    const [submissionData, setSubmissionData] = useState<FormSubmission[]>([])

    /**
     * Function to update the submission value of all form elements.
     * This function ensures that all elements contributing to form submission
     * have their values updated accordingly.
     * @param elementKey The element key
     * @param value The value
     */
    const updateData = (elementKey: string, value: string) => {
        if (form) {
            let storage = new FormStorage(form);
            let currVal = storage.loadFormDataFromStorage();
            const index = currVal.findIndex(submission => submission.elementKey === elementKey);
            if (index !== -1) {
                currVal[index] = { elementKey: elementKey, value };
            } else {
                currVal.push({ elementKey: elementKey, value });
            }
            storage.saveFormDataToStorage(currVal);
            setSubmissionData(currVal);
        }
    }

    /**
     * Function responsible for submitting the form.
     */
    const handleSubmit = (e: any) => {
        e.preventDefault()
        // The submission URL remains constant.
        const submitUrl = "http://localhost:8082/"
        if (form) {
            // Assemble data for submission.
            let model: FormSubmitModel = {
                formKey: form.key,
                locale: form.locale,
                hostedPageUrl: "location.pathname",
                submissionData: submissionData,
                // accessToken: accessToken,
                // This is for multi-step from which this example won't cover
                currentStepIndex: 0,
                isFinalized: true,
                partialSubmissionKey: "",
            }
            // Validation of form input fields.
            const formSubmitter = new FormSubmitter(form, submitUrl);
            let formValidationResults = formSubmitter.doValidate(submissionData);
            setValidateResult(formValidationResults);
            formValidationResults.forEach(validateResult => {
                if (!validateResult.result.valid) {
                    return;
                }
            });
            // Execution of form submission.
            formSubmitter.doSubmit(model).then((response: FormSubmitResult) => {
                seterrorMessage("");
                setsubmited(true);
                // In case of multi-step form, you can get the partialSubmissionKey in the response
            }).catch((e: ProblemDetail) => {
                seterrorMessage("From submission failed")
            })
        }
    }

    /**
     * Function to reset the form to its default values.
     */
    const handleReset = (e: any) => {
        e.preventDefault()
        if (form) {
            setSubmissionData([]);
            let storage = new FormStorage(form);
            storage.saveFormDataToStorage([]);
        }
        return;
    }

    /**
     * Configure initial values for form elements.
     */
    useEffect(() => {
        if (form) {
            let storage = new FormStorage(form);
            let formSubmissions = storage.loadFormDataFromStorage();
            storage.saveFormDataToStorage(formSubmissions);
            setSubmissionData(formSubmissions);
        }
    }, [form]);

    useEffect(() => {
        setFormData(formData)
    }, [formData]);

    return (
        <>
            {/* Section for displaying error messages */}
            {
                errorMessage &&
                <div className='form_error_message'>
                    {errorMessage}
                </div>
            }
            {/* Section for displaying submission success messages */}
            {
                submited &&
                <div className='form_success_message'>
                    The form has been submited successfully
                </div>
            }
            {form ?
                (
                    <form method="post"
                        noValidate={true}
                        encType="multipart/form-data"
                        id={form?.key}
                    >
                        {/* Form title */}
                        {form.properties.title &&
                            <h2 className="Form__Title" id={`${form.key}_label`}>
                                {form.properties.title}
                            </h2>
                        }
                        {/* Form elements */}
                        {/* This is just a quick example, in real project the use of multiple conditional statements is discouraged and should be minimized. */}
                        <div className="Form__MainBody">
                            {
                                form.formElements && form.formElements.map(
                                    (element: FormElementBase) => {
                                        let validationResult = validateResult.find(result => result.elementKey === element.key);
                                        if (element.contentType === "TextboxElementBlock") {
                                            let textbox = element as Textbox;
                                            return (
                                                <TextBoxElementBlock
                                                    submissionData={submissionData}
                                                    key={textbox.key}
                                                    element={textbox}
                                                    updateData={updateData}
                                                    validationResult={validationResult} />
                                            )
                                        }
                                        else if (element.contentType === "UrlElementBlock") {
                                            let url = element as Url;
                                            return (
                                                <UrlElementBlock
                                                    submissionData={submissionData}
                                                    key={url.key}
                                                    element={url}
                                                    updateData={updateData}
                                                    validationResult={validationResult} />
                                            )
                                        }
                                        else if (element.contentType === "TextareaElementBlock") {
                                            let textarea = element as Textarea;
                                            return (
                                                <TextareaElementBlock
                                                    submissionData={submissionData}
                                                    key={textarea.key}
                                                    element={textarea}
                                                    updateData={updateData}
                                                    validationResult={validationResult} />
                                            )
                                        }
                                        else if (element.contentType === "NumberElementBlock") {
                                            let number = element as Number;
                                            return (
                                                <NumberElementBlock
                                                    submissionData={submissionData}
                                                    key={number.key}
                                                    element={number}
                                                    updateData={updateData}
                                                    validationResult={validationResult} />
                                            )
                                        }
                                        else if (element.contentType === "SelectionElementBlock") {
                                            let selection = element as Selection;
                                            return (
                                                <SelectionElementBlock
                                                    submissionData={submissionData}
                                                    key={selection.key}
                                                    element={selection}
                                                    updateData={updateData}
                                                    validationResult={validationResult} />
                                            )
                                        }
                                        else if (element.contentType === "SubmitButtonElementBlock") {
                                            var submitButton = element as SubmitButton
                                            return (
                                                <SubmitButtonElementBlock
                                                    key={submitButton.key}
                                                    submitButton={submitButton}
                                                    handleSubmit={handleSubmit} />
                                            )
                                        }
                                        else if (element.contentType === "ResetButtonElementBlock") {
                                            var resetButton = element as ResetButton
                                            return (
                                                <ResetButtonElementBlock
                                                    key={resetButton.key}
                                                    resetButton={resetButton}
                                                    handleReset={handleReset} />
                                            )
                                        }
                                    })
                            }
                        </div>
                    </form>
                )
                :
                (
                    <div> Loading Form ...</div>
                )
            }
        </>
    );
};

export default FormComponent;
