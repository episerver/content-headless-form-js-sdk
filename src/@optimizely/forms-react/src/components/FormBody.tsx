import React, { useRef } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormContainer, FormSubmit, SubmitButtonType, equals, isInArray, isNull, isNullOrEmpty } from "@optimizely/forms-sdk";
import { RenderElementInStep } from "./RenderElementInStep";
import { DispatchFunctions } from "../context/dispatchFunctions";

export const FormBody = () => {
    const formContext = useForms();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const formSubmit = new FormSubmit(formContext?.formContainer ?? {} as FormContainer);
    const dispatch = useFormsDispatch();
    const dispatchFunctions = new DispatchFunctions(dispatch);
    
    const formTitleId = `${form.key}_label`;
    const statusDisplay = useRef<string>("hide");
    const stepCount = form.steps.length;
    const statusMessage = useRef<string>("");
    const stepLocalizations = useRef<Record<string, string>>(form.steps?.filter(s => !isNull(s.formStep.localizations))[0]?.formStep.localizations);

    //TODO: these variables should be get from api or sdk
    const validateFail = false,
    formFinalized = false,
    isProgressiveSubmit = false,
    isSuccess = false,
    submittable = true,
    submissionWarning = false,
    message = "",
    isReadOnlyMode = false,
    readOnlyModeMessage = "",
    currentStepIndex = 0,
    isStepValidToDisplay = true;

    if(formFinalized || isProgressiveSubmit)
    {
        statusDisplay.current = "Form__Success__Message";
        statusMessage.current = form.properties.submitSuccessMessage ?? message;
    }
    else if((submissionWarning || (!submittable && !isSuccess)) 
        && message)
    {
        statusDisplay.current = "Form__Warning__Message";
        statusMessage.current = message;
    }
    const validationCssClass = validateFail ? "ValidationFail" : "ValidationSuccess";
    const isShowStepNavigation = stepCount > 1 && currentStepIndex > -1 && currentStepIndex < stepCount && !formFinalized;
    const prevButtonDisableState = (currentStepIndex == 0) || !submittable;
    const nextButtonDisableState = (currentStepIndex == stepCount - 1) || !submittable;
    const currentDisplayStepIndex = currentStepIndex + 1;
    const progressWidth = (100 * currentDisplayStepIndex / stepCount) + "%";

    const handleSubmit = (e: any) => {
        e.preventDefault();
        
        let formSubmissions = (formContext?.formSubmissions ?? [])
                                //only post value of active elements
                                .filter(fs => !isInArray(fs.elementKey, formContext?.dependencyInactiveElements ?? []));
        //validate all submission data before submit
        let formValidationResults = formSubmit.doValidate(formSubmissions);
        dispatchFunctions.dispatchUpdateAllValidation(formValidationResults);
        
        //set focus on the 1st invalid element of current step
        let invalid = formValidationResults.filter(fv => 
                fv.results.some(r => !r.valid) &&    
                form.steps[currentStepIndex]?.elements?.some(e => equals(e.key, fv.elementKey))
            )[0]?.elementKey;
        if(!isNullOrEmpty(invalid)){
            dispatchFunctions.dispatchFocusOn(invalid);
            return;
        }
        
        formSubmit.doSubmit(formSubmissions);
    }

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
                    let stepDisplaying = (currentStepIndex === i && !formFinalized && isStepValidToDisplay) ? "" : "hide";
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