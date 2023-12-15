import React, { useEffect, useRef } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormContainer, FormSubmitter, IdentityInfo, SubmitButtonType, equals, isInArray, isNull, isNullOrEmpty, FormSubmitModel, FormSubmitResult, SubmitButton, ElementValidationResult, FormValidationResult } from "@episerver/forms-sdk";
import { RenderElementInStep } from "./RenderElementInStep";
import { DispatchFunctions } from "../context/dispatchFunctions";
import { FormStepNavigation } from "./FormStepNavigation";

interface FormBodyProps {
    identityInfo?: IdentityInfo;
    baseUrl: string;
    history?: any
}

export const FormBody = (props: FormBodyProps) => {
    const formContext = useForms();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const formSubmitter = new FormSubmitter(formContext?.formContainer ?? {} as FormContainer, props.baseUrl);
    const dispatchFunctions = new DispatchFunctions();
    
    const formTitleId = `${form.key}_label`;
    const statusMessage = useRef<string>("");
    const statusDisplay = useRef<string>("hide");

    //TODO: these variables should be get from api or sdk
    const validateFail = useRef<boolean>(false),
        isFormFinalized = useRef<boolean>(false),
        isProgressiveSubmit = useRef<boolean>(false),
        isSuccess = useRef<boolean>(false),
        submittable = true,
        submissionWarning = useRef<boolean>(false),
        message = useRef<string>(""),
        isReadOnlyMode = false,
        readOnlyModeMessage = "",
        currentStepIndex = formContext?.currentStepIndex ?? 0,
        isStepValidToDisplay = true;

    if((isFormFinalized.current || isProgressiveSubmit.current) && isSuccess.current)
        {
        statusDisplay.current = "Form__Success__Message";
        statusMessage.current = form.properties.submitSuccessMessage ?? message.current;
    }
    else if ((submissionWarning.current || (!submittable && !isSuccess.current))
        && !isNullOrEmpty(message.current)) {
        statusDisplay.current = "Form__Warning__Message";
        statusMessage.current = message.current;
    }
    
    const validationCssClass = validateFail.current ? "ValidationFail" : "ValidationSuccess";

    const isInCurrentStep = (elementKey: string): boolean => {
        let currentStep = form.steps[currentStepIndex];
        if(currentStep){
            return currentStep.elements.some(e => equals(e.key, elementKey));
        }
        return true;
    }

    const getFirstInvalidElement = (formValidationResults: FormValidationResult[]): string => {
        return formValidationResults.filter(fv => 
            fv.results.some(r => !r.valid) &&    
            form.steps[currentStepIndex]?.elements?.some(e => equals(e.key, fv.elementKey))
        )[0]?.elementKey;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!form.properties.allowAnonymousSubmission && isNullOrEmpty(formContext?.identityInfo?.accessToken)) {
            return;
        }

        //Find submit button, if found then check property 'finalizeForm' of submit button. Otherwise, button Next/Previous was clicked.
        let buttonId = e.nativeEvent.submitter.id;
        let submitButton = form.formElements.find(fe => fe.key === buttonId) as SubmitButton;
        if (!isNull(submitButton)) {
            //when submitting by SubmitButton, isProgressiveSubmit default is true
            isProgressiveSubmit.current = true;
        }
        //filter submissions by active elements and current step
        let formSubmissions = (formContext?.formSubmissions ?? [])
            .filter(fs => !isInArray(fs.elementKey, formContext?.dependencyInactiveElements ?? []) && isInCurrentStep(fs.elementKey));

        //validate all submission data before submit
        let formValidationResults = formSubmitter.doValidate(formSubmissions);
        dispatchFunctions.updateAllValidation(formValidationResults);
        
        //set focus on the 1st invalid element of current step
        let invalid = getFirstInvalidElement(formValidationResults);
        if(!isNullOrEmpty(invalid)){
            dispatchFunctions.updateFocusOn(invalid);
            return;
        }

        let isLastStep = formContext?.currentStepIndex === form.steps.length - 1;
        let model: FormSubmitModel = {
            formKey: form.key,
            locale: form.locale,
            isFinalized: submitButton?.properties?.finalizeForm || isLastStep,
            partialSubmissionKey: formContext?.submissionKey ?? "",
            hostedPageUrl: window.location.pathname,
            submissionData: formSubmissions,
            accessToken: formContext?.identityInfo?.accessToken
        }

        dispatchFunctions.updateIsSubmitting(true);
        formSubmitter.doSubmit(model).then((response: FormSubmitResult)=>{
            //get error or success message
            if(response.success){
                message.current = response.messages.map(m => m.message).join("<br>");
            }
            else {
                submissionWarning.current = true;
                //ignore validation message
                message.current = response.messages.filter(m => isNullOrEmpty(m.identifier)).map(m => m.message).join("<br>");
            }
            //update validation message
            if(response.validationFail){
                let formValidationResults = formContext?.formValidationResults?.map(fr => {
                    let errorMessages = response.messages.filter(m => equals(m.identifier, fr.elementKey));
                    return errorMessages.length === 0 ? fr : {
                        ...fr,
                        results: fr.results.map(er => !errorMessages.some(em => equals(em.section, er.type)) ? er : {
                            ...er,
                            valid: false
                        })
                    } as FormValidationResult
                }) ?? [];

                dispatchFunctions.updateAllValidation(formValidationResults);

                //set focus on the 1st invalid element of current step
                dispatchFunctions.updateFocusOn(getFirstInvalidElement(formValidationResults));
            }
            validateFail.current = response.validationFail;
            isSuccess.current = response.success;
            isFormFinalized.current = isLastStep && response.success;
            dispatchFunctions.updateSubmissionKey(response.submissionKey);
            dispatchFunctions.updateIsSubmitting(false);
        });
    }

    useEffect(() => {
        dispatchFunctions.updateIdentity(props.identityInfo);
        if (isNullOrEmpty(props.identityInfo?.accessToken) && !form.properties.allowAnonymousSubmission) {
            statusDisplay.current = "Form__Warning__Message";
            statusMessage.current = "You must be logged in to submit this form. If you are logged in and still cannot post, make sure \"Do not track\" in your browser settings is disabled.";
        }
        else {
            statusMessage.current = "";
            statusDisplay.current = "hide";
        }
    }, [props.identityInfo?.accessToken]);

    return (
        <form method="post"
            noValidate={true}
            aria-labelledby={formTitleId}
            encType="multipart/form-data"
            className={`EPiServerForms ${validationCssClass}`}
            id={form.key}
            onSubmit={handleSubmit}
        >
            {form.properties.title &&
                <h2 className="Form__Title" id={formTitleId}>
                    {form.properties.title}
                </h2>
            }
            {form.properties.description &&
                <aside className="Form__Description">
                    {form.properties.description}
                </aside>
            }
            {isReadOnlyMode && readOnlyModeMessage &&
                <div className="Form__Status">
                    <span className="Form__Readonly__Message" role="alert">
                        {readOnlyModeMessage}
                    </span>
                </div>
            }
            {/* area for showing Form's status or validation */}
            <div className="Form__Status">
                <div role="status" className={`Form__Status__Message ${statusDisplay.current}`}>
                    <div dangerouslySetInnerHTML={{
                        __html: statusMessage.current
                    }}
                    ></div>
                </div>
            </div>

            <div className="Form__MainBody">
                {/* render element */}
                {form.steps.map((e, i) => {
                    let stepDisplaying = (currentStepIndex === i && !isFormFinalized.current && isStepValidToDisplay) ? "" : "hide";
                    return (
                        <section key={e.formStep.key} id={e.formStep.key} className={`Form__Element__Step ${stepDisplaying}`}>
                            <RenderElementInStep elements={e.elements} stepIndex={i} />
                        </section>
                    );
                })}

                {/* render step navigation*/}
                <FormStepNavigation
                    isFormFinalized={isFormFinalized.current}
                    history = {props.history}
                />
            </div>
        </form>
    )
}