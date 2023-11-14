import React, { useRef } from "react";
import { FormContainer, StepBuilder } from "@optimizely/forms-sdk";
import { RenderElementInStep } from "./RenderElementInStep";
import { SubmitButtonType } from "../models/SubmitButtonType";
import { FormProvider } from "../context/FormProvider";
import { initState } from "../context/initState";

export interface FormContainerProps {
    form: FormContainer
}

export function FormContainerBlock(props: FormContainerProps){
    const stepBuilder = new StepBuilder(props.form);
    const form = stepBuilder.buildForm();
    const formTitleId = `${form.key}_label`;
    const statusDisplay = useRef<string>("hide");
    const stepCount = form.steps.length;
    const statusMessage = useRef<string>("");

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

    const FormBody = () => {
        return (
            <>
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
                                {form.localizations["previousButtonLabel"]}
                            </button>
                            
                            <div className="Form__NavigationBar__ProgressBar">
                                <div className="Form__NavigationBar__ProgressBar--Progress" style={{width: progressWidth}}></div>
                                <div className="Form__NavigationBar__ProgressBar--Text">
                                    <span className="Form__NavigationBar__ProgressBar__ProgressLabel">{form.localizations["pageButtonLabel"]}</span>
                                    <span className="Form__NavigationBar__ProgressBar__CurrentStep">{currentDisplayStepIndex}</span>/
                                    <span className="Form__NavigationBar__ProgressBar__StepsCount">{stepCount}</span>
                                </div>
                            </div>
                            <button type="submit" name="submit" value={SubmitButtonType.NextStep} className="Form__NavigationBar__Action FormExcludeDataRebind btnNext"
                                    disabled={nextButtonDisableState}>
                                {form.localizations["nextButtonLabel"]}
                            </button>
                        </nav>
                    }
                </div>
            </>
        )
    }

    const state = initState({formContainer: form});

    {/* finally return the form */}
    return (
        <FormProvider initialState={state}>
            <form method="post" 
                noValidate={true} 
                aria-labelledby={formTitleId}
                encType="multipart/form-data" 
                className={`EPiServerForms ${validationCssClass}`}
                id={form.key}>
                    <FormBody />
            </form>
        </FormProvider>
    )
}