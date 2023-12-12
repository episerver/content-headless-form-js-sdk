import React, { useEffect, useRef } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormContainer, FormSubmitter, IdentityInfo, SubmitButtonType, equals, isInArray, isNull, isNullOrEmpty, FormSubmitModel, FormSubmitResult, SubmitButton } from "@episerver/forms-sdk";
import { RenderElementInStep } from "./RenderElementInStep";
import { DispatchFunctions } from "../context/dispatchFunctions";

interface FormBodyProps {
    identityInfo?: IdentityInfo;
    baseUrl: string;
}

export const FormBody = (props: FormBodyProps) => {
    const formContext = useForms();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const formSubmitter = new FormSubmitter(formContext?.formContainer ?? {} as FormContainer, props.baseUrl);
    const dispatch = useFormsDispatch();
    const dispatchFunctions = new DispatchFunctions(dispatch);
    
    const formTitleId = `${form.key}_label`;
    const stepCount = form.steps.length;
    const statusMessage = useRef<string>("");
    const statusDisplay = useRef<string>("hide");
    const stepLocalizations = useRef<Record<string, string>>(form.steps?.filter(s => !isNull(s.formStep.localizations))[0]?.formStep.localizations);

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

    if(isSuccess.current && isFormFinalized.current)
    {
        statusDisplay.current = "Form__Success__Message";
        statusMessage.current = form.properties.submitSuccessMessage ?? message.current;
    }
    else if((submissionWarning.current || (!submittable && !isSuccess.current)) 
        && !isNullOrEmpty(message.current))
    {
        statusDisplay.current = "Form__Warning__Message";
        statusMessage.current = message.current;
    }
    const validationCssClass = validateFail.current ? "ValidationFail" : "ValidationSuccess";
    const isShowStepNavigation = stepCount > 1 && currentStepIndex > -1 && currentStepIndex < stepCount && !isFormFinalized;
    const prevButtonDisableState = (currentStepIndex == 0) || !submittable;
    const nextButtonDisableState = (currentStepIndex == stepCount - 1) || !submittable;
    const currentDisplayStepIndex = currentStepIndex + 1;
    const progressWidth = (100 * currentDisplayStepIndex / stepCount) + "%";

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        if(!form.properties.allowAnonymousSubmission && isNullOrEmpty(formContext?.identityInfo?.accessToken)){
            return;
        }

        //Find submit button, if found then check property 'finalizeForm' of submit button. Otherwise, button Next/Previous was clicked.
        let buttonId = e.nativeEvent.submitter.id;
        let submitButton = form.formElements.filter(fe => fe.key === buttonId)[0] as SubmitButton;
        if(!isNull(submitButton)){
            //when submitting by SubmitButton, isProgressiveSubmit default is true
            isProgressiveSubmit.current = true;
        }
        
        isFormFinalized.current = submitButton?.properties?.finalizeForm || formContext?.currentStepIndex === form.steps.length - 1;

        //remove submissions of inactive elements and submissions with undefined value
        let formSubmissions = (formContext?.formSubmissions ?? [])
                                //only post value of active elements
                                .filter(fs => !isInArray(fs.elementKey, formContext?.dependencyInactiveElements ?? []) && !isNull(fs.value));

        //validate all submission data before submit
        let formValidationResults = formSubmitter.doValidate(formSubmissions);
        dispatchFunctions.dispatchUpdateAllValidation(formValidationResults);
        
        //set focus on the 1st invalid element of current step
        let invalid = formValidationResults.filter(fv => 
                fv.results.some(r => !r.valid) &&    
                form.steps[currentStepIndex]?.elements?.some(e => equals(e.key, fv.elementKey))
            )[0]?.elementKey;
        if(!isNullOrEmpty(invalid)){
            dispatchFunctions.dispatchFocusOn(invalid);
            isFormFinalized.current = false;
            return;
        }
        
        let model: FormSubmitModel = {
            formKey: form.key,
            locale: form.locale,
            isFinalized: isFormFinalized.current,
            partialSubmissionKey: formContext?.submissionKey ?? "",
            hostedPageUrl: window.location.pathname,
            submissionData: formSubmissions,
            accessToken: formContext?.identityInfo?.accessToken
        }

        formSubmitter.doSubmit(model).then((response: FormSubmitResult)=>{
            if(response.success){
                message.current = response.messages.map(m => m.message).join("<br>");
            }
            else {
                submissionWarning.current = true;
                //ignore validation message
                message.current = response.messages.filter(m => isNullOrEmpty(m.identifier)).map(m => m.message).join("<br>");
            }
            validateFail.current = response.validationFail;
            isFormFinalized.current = isSuccess.current = response.success;
            dispatchFunctions.dispatchUpdateSubmissionKey(response.submissionKey);
        });
    }

    useEffect(()=>{
        dispatchFunctions.dispatchUpdateIdentity(props.identityInfo);
        if(isNullOrEmpty(props.identityInfo?.accessToken) && !form.properties.allowAnonymousSubmission){
            statusDisplay.current = "Form__Warning__Message";
            statusMessage.current = "You must be logged in to submit this form. If you are logged in and still cannot post, make sure \"Do not track\" in your browser settings is disabled.";
        }
        else {
            statusMessage.current = "";
            statusDisplay.current = "hide";
        }
    },[props.identityInfo?.accessToken]);

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
                {form.steps.map((e, i)=>{
                    let stepDisplaying = (currentStepIndex === i && !isFormFinalized.current && isStepValidToDisplay) ? "" : "hide";
                    return (
                        <section key={e.formStep.key} id={e.formStep.key} className={`Form__Element__Step ${stepDisplaying}`}>
                            <RenderElementInStep elements={e.elements} stepIndex={i} />
                        </section>
                    );
                })}

                {/* render step navigation */}
                {isShowStepNavigation && 
                    <nav role="navigation" className="Form__NavigationBar">
                        <button type="submit" name="submit" value={SubmitButtonType.PreviousStep} className="Form__NavigationBar__Action FormExcludeDataRebind btnPrev"
                                disabled={prevButtonDisableState}>
                            {stepLocalizations.current["previousButtonLabel"]}
                        </button>
                        
                        <div className="Form__NavigationBar__ProgressBar">
                            <div className="Form__NavigationBar__ProgressBar--Progress" style={{width: progressWidth}}></div>
                            <div className="Form__NavigationBar__ProgressBar--Text">
                                <span className="Form__NavigationBar__ProgressBar__ProgressLabel">{stepLocalizations.current["pageButtonLabel"]}</span>
                                <span className="Form__NavigationBar__ProgressBar__CurrentStep">{currentDisplayStepIndex}</span>/
                                <span className="Form__NavigationBar__ProgressBar__StepsCount">{stepCount}</span>
                            </div>
                        </div>
                        <button type="submit" name="submit" value={SubmitButtonType.NextStep} className="Form__NavigationBar__Action FormExcludeDataRebind btnNext"
                                disabled={nextButtonDisableState}>
                            {stepLocalizations.current["nextButtonLabel"]}
                        </button>
                    </nav>
                }
            </div>
        </form>
    )
}