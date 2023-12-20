import React, { useRef } from "react";
import { useForms } from "../context/store";
import { FormContainer, FormStep, StepDependCondition, SubmitButtonType, isNull } from "@episerver/forms-sdk";

interface FormStepNavigationProps {
    isFormFinalized: boolean;
    history?: any;
    handleSubmit: (e: any) => Promise<boolean>;
    isMalFormSteps: boolean;
    isStepValidToDisplay: boolean;
    currentStepIndex: number;
}

export const FormStepNavigation = (props: FormStepNavigationProps) => {
    const formContext = useForms();
    const form = formContext?.formContainer ?? {} as FormContainer;
    const depend = new StepDependCondition(form, formContext?.dependencyInactiveElements ?? []);
    const { isFormFinalized, history, handleSubmit, isMalFormSteps, isStepValidToDisplay, currentStepIndex } = props;
    const stepLocalizations = useRef<Record<string, string>>(form.steps?.filter(s => !isNull(s.formStep.localizations))[0]?.formStep.localizations).current;

    const submittable = true
    const stepCount = form.steps.length;

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
        let isSuccess = await handleSubmit(event);
        isSuccess && goToStep(depend.findNextStep(currentStepIndex) ?? 0);
    }

    const goToStep = (stepIndex: number) => {
        var step = form.steps[stepIndex].formStep as FormStep

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