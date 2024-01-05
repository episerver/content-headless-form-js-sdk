import React, { useEffect, useRef } from "react";
import { useForms } from "../context/store";
import { FormCache, FormConstants, FormContainer, StepDependCondition, SubmitButtonType, isNull, isNullOrEmpty } from "@episerver/forms-sdk";
import { DispatchFunctions } from "../context/dispatchFunctions";

interface FormStepNavigationProps {
    isFormFinalized: boolean;
    history?: any;
    handleSubmit: (e: any) => void;
    isMalFormSteps: boolean;
    isStepValidToDisplay: boolean;
    isSuccess: boolean;
}

export const FormStepNavigation = (props: FormStepNavigationProps) => {
    const formContext = useForms();
    const formCache = new FormCache();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const depend = new StepDependCondition(form, formContext?.dependencyInactiveElements ?? []);
    const { isFormFinalized, history, handleSubmit, isMalFormSteps, isStepValidToDisplay, isSuccess } = props;
    const dispatchFuncs = new DispatchFunctions();
    const stepLocalizations = useRef<Record<string, string>>(form.steps?.filter(s => !isNull(s.formStep.localizations))[0]?.formStep.localizations).current;
    const isNextStep = useRef<boolean>(false);

    const submittable = true
    const stepCount = form.steps.length;

    const currentStepIndex = formContext?.currentStepIndex ?? 0;
    const currentDisplayStepIndex = currentStepIndex + 1;
    const prevButtonDisableState = (currentStepIndex == 0) || !submittable;
    const nextButtonDisableState = (currentStepIndex == stepCount - 1) || !submittable;
    const progressWidth = (100 * currentDisplayStepIndex / stepCount) + "%";

    const isShowStepNavigation = stepCount > 1 && currentStepIndex > -1 && currentStepIndex < stepCount && !isFormFinalized && !isMalFormSteps && isStepValidToDisplay;

    const handlePrevStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        goToStep(depend.findPreviousStep(currentStepIndex) ?? 0)
    }

    const handleNextStep = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        handleSubmit(event);
        isNextStep.current = true;
    }

    const goToStep = (stepIndex: number) => {
        var attachedContentLink = form.steps[stepIndex]?.formStep?.properties?.attachedContentLink;

        formCache.set<number>(FormConstants.FormCurrentStep + form.key, stepIndex);
        dispatchFuncs.updateCurrentStepIndex(stepIndex);
        if (!isNullOrEmpty(attachedContentLink)) {
            let url = new URL(attachedContentLink);
            history && history.push(url.pathname);
        }
    }

    useEffect(()=>{
        if(isSuccess && isNextStep.current) { 
            goToStep(depend.findNextStep(currentStepIndex) ?? 0);
            isNextStep.current = false;
        }
    },[isSuccess]);

    return (
        <>
            {isShowStepNavigation && form.properties.showNavigationBar &&
                <nav role="navigation" className="Form__NavigationBar">
                    <button
                        type="submit"
                        name="submit"
                        value={SubmitButtonType.PreviousStep}
                        className="Form__NavigationBar__Action FormExcludeDataRebind btnPrev"
                        disabled={prevButtonDisableState}
                        onClick={(event) => handlePrevStep(event)}
                    >
                        {stepLocalizations["previousButtonLabel"]}
                    </button>

                    <div className="Form__NavigationBar__ProgressBar">
                        <div className="Form__NavigationBar__ProgressBar--Progress" style={{ width: progressWidth }}></div>
                        <div className="Form__NavigationBar__ProgressBar--Text">
                            <span className="Form__NavigationBar__ProgressBar__ProgressLabel">{stepLocalizations["pageButtonLabel"]}</span>
                            <span className="Form__NavigationBar__ProgressBar__CurrentStep">{currentDisplayStepIndex}</span>/
                            <span className="Form__NavigationBar__ProgressBar__StepsCount">{stepCount}</span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        name="submit"
                        value={SubmitButtonType.NextStep}
                        className="Form__NavigationBar__Action FormExcludeDataRebind btnNext"
                        disabled={nextButtonDisableState}
                        onClick={handleNextStep}
                    >
                        {stepLocalizations["nextButtonLabel"]}
                    </button>
                </nav>
            }
        </>
    )
}