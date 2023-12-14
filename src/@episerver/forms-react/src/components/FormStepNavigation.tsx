import React from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormCache, FormConstants, FormContainer, FormStep, StepDependCondition, SubmitButtonType, isNull } from "@episerver/forms-sdk";
import { DispatchFunctions } from "../context/dispatchFunctions";
import { useHistory } from "react-router-dom";

interface FormStepNavigationProps {
    stepLocalizations: React.MutableRefObject<Record<string, string>>
    form: FormContainer
    isFormFinalized: React.MutableRefObject<boolean>
    history?: any
}

export const FormStepNavigation = (props: FormStepNavigationProps) => {
    const formContext = useForms()
    const formCache = new FormCache()
    const dispatch = useFormsDispatch()
    const history = props.history
    const depend = new StepDependCondition(props.form, formContext?.dependencyInactiveElements ?? [])
    const { stepLocalizations, form, isFormFinalized } = props;
    const dispatchFuncs = new DispatchFunctions(dispatch);

    const submittable = true
    const stepCount = form.steps.length;

    const currentStepIndex = formContext?.currentStepIndex ?? 0
    const currentDisplayStepIndex = currentStepIndex + 1;
    const prevButtonDisableState = (currentStepIndex == 0) || !submittable;
    const nextButtonDisableState = (currentStepIndex == stepCount - 1) || !submittable;
    const progressWidth = (100 * currentDisplayStepIndex / stepCount) + "%";

    const isShowStepNavigation = stepCount > 1 && currentStepIndex > -1 && currentStepIndex < stepCount && !isFormFinalized.current;

    const handlePrevStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        goToStep(depend.findPreviousStep(currentStepIndex) ?? 0)
    }

    const handleNextStep = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        goToStep(depend.findNextStep(currentStepIndex) ?? 0)
    }

    const goToStep = (stepIndex: number) => {
        var step = form.steps[stepIndex].formStep as FormStep

        formCache.set<number>(FormConstants.FormCurrentStep + props.form.key, stepIndex)
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
                        {stepLocalizations.current["previousButtonLabel"]}
                    </button>

                    <div className="Form__NavigationBar__ProgressBar">
                        <div className="Form__NavigationBar__ProgressBar--Progress" style={{ width: progressWidth }}></div>
                        <div className="Form__NavigationBar__ProgressBar--Text">
                            <span className="Form__NavigationBar__ProgressBar__ProgressLabel">{stepLocalizations.current["pageButtonLabel"]}</span>
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
                        {stepLocalizations.current["nextButtonLabel"]}
                    </button>
                </nav>
            }
        </>
    )
}