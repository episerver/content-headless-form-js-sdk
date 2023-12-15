import React from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormCache, FormConstants, FormContainer, FormStep, StepDependCondition, SubmitButtonType, isNull } from "@episerver/forms-sdk";
import { DispatchFunctions } from "../context/dispatchFunctions";

interface FormStepNavigationProps {
    stepLocalizations: Record<string, string>
    form: FormContainer
    isFormFinalized: boolean
    history?: any
    handleSubmit: (e: any) => void
}

export const FormStepNavigation = (props: FormStepNavigationProps) => {
    const formContext = useForms()
    const formCache = new FormCache()
    const history = props.history
    const depend = new StepDependCondition(props.form, formContext?.dependencyInactiveElements ?? [])
    const { stepLocalizations, form, isFormFinalized, handleSubmit } = props;
    const dispatchFuncs = new DispatchFunctions();

    const submittable = true
    const stepCount = form.steps.length;

    const currentStepIndex = formContext?.currentStepIndex ?? 0
    const currentDisplayStepIndex = currentStepIndex + 1;
    const prevButtonDisableState = (currentStepIndex == 0) || !submittable;
    const nextButtonDisableState = (currentStepIndex == stepCount - 1) || !submittable;
    const progressWidth = (100 * currentDisplayStepIndex / stepCount) + "%";

    const isShowStepNavigation = stepCount > 1 && currentStepIndex > -1 && currentStepIndex < stepCount && !isFormFinalized;

    const handlePrevStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        goToStep(depend.findPreviousStep(currentStepIndex) ?? 0)
    }

    const handleNextStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        handleSubmit(event)
        goToStep(depend.findNextStep(currentStepIndex) ?? 0)
    }

    const goToStep = (stepIndex: number) => {
        var step = form.steps[stepIndex].formStep as FormStep

        formCache.set<number>(FormConstants.FormCurrentStep + form.key, stepIndex)
        dispatchFuncs.updateCurrentStepIndex(stepIndex)

        if (!isNull(step) && !isNull(step.properties.attachedContentLink)) {
            let url = new URL(step.properties.attachedContentLink)
            history && history.push(url.pathname);
        }
    }

    return (
        <>
            {isShowStepNavigation &&
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