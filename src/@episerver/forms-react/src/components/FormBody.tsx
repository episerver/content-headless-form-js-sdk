import React, { useEffect, useRef } from "react";
import { useForms } from "../context/store";
import { FormContainer, FormSubmitter, IdentityInfo, isInArray, isNull, isNullOrEmpty, FormSubmitModel, FormSubmitResult, SubmitButton, FormCache, FormConstants, ProblemDetail, StepDependCondition } from "@episerver/forms-sdk";
import { RenderElementInStep } from "./RenderElementInStep";
import { DispatchFunctions } from "../context/dispatchFunctions";
import { FormStepNavigation } from "./FormStepNavigation";
import { StepHelper } from "@episerver/forms-sdk/dist/form-step/stepHelper";

interface FormBodyProps {
    identityInfo?: IdentityInfo;
    baseUrl: string;
    history?: any;
    currentPageUrl?: string;
}

export const FormBody = (props: FormBodyProps) => {
    const formContext = useForms();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const inactiveElements = formContext?.dependencyInactiveElements ?? [];
    const formSubmitter = new FormSubmitter(formContext?.formContainer ?? {} as FormContainer, props.baseUrl);
    const dispatchFunctions = new DispatchFunctions();
    const stepDependCondition = new StepDependCondition(form, inactiveElements);
    const stepHelper = new StepHelper(form);
    const currentPageUrl = props.currentPageUrl ?? window.location.href;
    
    const formTitleId = `${form.key}_label`;
    const statusMessage = useRef<string>("");
    const statusDisplay = useRef<string>("hide");

    const formCache = new FormCache();
    const localFormCache = new FormCache(window.localStorage);
    const currentStepIndex = formContext?.currentStepIndex ?? 0;

    //TODO: these variables should be get from api or sdk
    const validateFail = useRef<boolean>(false),
        isFormFinalized = useRef<boolean>(false),
        isProgressiveSubmit = useRef<boolean>(false),
        isSuccess = useRef<boolean>(false),
        submissionWarning = useRef<boolean>(false),
        message = useRef<string>(""),
        submissionStorageKey = FormConstants.FormSubmissionId + form.key,
        isStepValidToDisplay = stepDependCondition.isStepValidToDisplay(currentStepIndex, currentPageUrl),
        isMalFormSteps = stepHelper.isMalFormSteps();
    
    if((isFormFinalized.current || isProgressiveSubmit.current) && isSuccess.current)
    {
        statusDisplay.current = "Form__Success__Message";
        statusMessage.current = form.properties.submitSuccessMessage ?? message.current;
    }
    else if ((submissionWarning.current || !isSuccess.current)
        && !isNullOrEmpty(message.current)) {
        statusDisplay.current = "Form__Warning__Message";
        statusMessage.current = message.current;
    }
    else {
        statusDisplay.current = "hide";
        statusMessage.current = "";
    }
    
    const validationCssClass = validateFail.current ? "ValidationFail" : "ValidationSuccess";

    const showError = (error: string) => {
        submissionWarning.current = !isNullOrEmpty(error);
        message.current = error;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!form.properties.allowAnonymousSubmission && isNullOrEmpty(formContext?.identityInfo?.accessToken)) {
            return;
        }

        //Find submit button, if found then check property 'finalizeForm' of submit button. Otherwise, button Next/Previous was clicked.
        let buttonId = e.nativeEvent.submitter?.id;
        let submitButton = form.formElements.find(fe => fe.key === buttonId) as SubmitButton;
        if (!isNull(submitButton)) {
            //when submitting by SubmitButton, isProgressiveSubmit default is true
            isProgressiveSubmit.current = true;
        }
        //filter submissions by active elements and current step
        let formSubmissions = (formContext?.formSubmissions ?? [])
            .filter(fs => !isInArray(fs.elementKey, formContext?.dependencyInactiveElements ?? []) && stepHelper.isInCurrentStep(fs.elementKey, currentStepIndex));

        //validate all submission data before submit
        let formValidationResults = formSubmitter.doValidate(formSubmissions);
        dispatchFunctions.updateAllValidation(formValidationResults);
        
        //set focus on the 1st invalid element of current step
        let invalid = stepHelper.getFirstInvalidElement(formValidationResults, currentStepIndex);
        if(!isNullOrEmpty(invalid)){
            dispatchFunctions.updateFocusOn(invalid);
            return;
        }

        let isLastStep = currentStepIndex === form.steps.length - 1;
        let model: FormSubmitModel = {
            formKey: form.key,
            locale: form.locale,
            isFinalized: submitButton?.properties?.finalizeForm || isLastStep,
            partialSubmissionKey: localFormCache.get(submissionStorageKey) ?? formContext?.submissionKey ?? "",
            hostedPageUrl: currentPageUrl,
            submissionData: formSubmissions,
            accessToken: formContext?.identityInfo?.accessToken,
            currentStepIndex: currentStepIndex
        }

        //submit data to API
        dispatchFunctions.updateIsSubmitting(true);
        formSubmitter.doSubmit(model).then((response: FormSubmitResult)=>{
            //go here, response.success always is true
            isSuccess.current = response.success;
            isFormFinalized.current = isLastStep && response.success;
            dispatchFunctions.updateSubmissionKey(response.submissionKey);
            localFormCache.set(submissionStorageKey, response.submissionKey);

            if (isFormFinalized.current) {
                formCache.remove(FormConstants.FormCurrentStep + form.key);
                localFormCache.remove(submissionStorageKey);
                message.current = response.messages.map(m => m.message).join("<br>");
            }
        }).catch((e: ProblemDetail) => {
            switch(e.status){
                case 401:
                    //clear access token to ask login again
                    dispatchFunctions.updateIdentity({} as IdentityInfo);
                    formCache.remove(FormConstants.FormAccessToken);
                    break;
                case 400:
                    //validate fail
                    validateFail.current = false;
                    let formValidationResults = formContext?.formValidationResults?.map(fr => isNull(e.errors[fr.elementKey]) ? fr : {
                        ...fr,
                        result: { valid: false, message: e.errors[fr.elementKey].join("<br/>") }
                    }) ?? [];

                    dispatchFunctions.updateAllValidation(formValidationResults);

                    //set focus on the 1st invalid element of current step
                    dispatchFunctions.updateFocusOn(stepHelper.getFirstInvalidElement(formValidationResults, currentStepIndex));
                    break;
            }

            showError(e.detail);
        }).finally(()=>{
            dispatchFunctions.updateIsSubmitting(false);
        });
    }

    useEffect(() => {
        dispatchFunctions.updateIdentity(props.identityInfo);
        if (isNullOrEmpty(props.identityInfo?.accessToken) && !form.properties.allowAnonymousSubmission) {
            showError(form.localizations["allowAnonymousSubmissionErrorMessage"]);
        }
        else {
            showError("");
        }
    }, [props.identityInfo?.accessToken]);

    //reset when change page
    useEffect(()=>{
        isSuccess.current = false;
    },[currentStepIndex]);

    //Run in-case change page by url. The currentStepIndex that get from cache is incorrect.
    useEffect(()=>{
        if(!isStepValidToDisplay){
            dispatchFunctions.updateCurrentStepIndex(stepHelper.getCurrentStepIndex(currentPageUrl));
        }
    },[]);

    isMalFormSteps && showError("Improperly formed FormStep configuration. Some steps are attached to pages, while some steps are not attached, or attached to content with no public URL.");

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
                    let stepDisplaying = (currentStepIndex === i && !isFormFinalized.current && isStepValidToDisplay && !isMalFormSteps) ? "" : "hide";
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
                    handleSubmit = {handleSubmit}
                    isMalFormSteps = {isMalFormSteps}
                    isStepValidToDisplay = {isStepValidToDisplay}
                    isSuccess = {isSuccess.current}
                />
            </div>
        </form>
    )
}