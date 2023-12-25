import { FormContainer, ElementValidationResult, FormValidationResult, initFormState, IdentityInfo } from "@episerver/forms-sdk";
import { ActionType } from "./reducer";
import { useFormsDispatch } from "./store";

export class DispatchFunctions {
    readonly _dispatch: any
    constructor(){
        this._dispatch = useFormsDispatch();
    }

    updateValidation = (elementKey: string, validationResult: ElementValidationResult) => {
        this._dispatch({
            type: ActionType.UpdateValidation,
            elementKey: elementKey,
            validationResult
        });
    }

    updateAllValidation = (formValidationResults: FormValidationResult[]) => {
        this._dispatch({
            type: ActionType.UpdateAllValidation,
            formValidationResults
        });
    }

    updateValue = (elementKey: string, value: any) => {
        this._dispatch({
            type: ActionType.UpdateValue,
            elementKey: elementKey,
            value
        });
    }

    updateDependencies = (dependencyInactiveElements: string[]) => {
        this._dispatch({
            type: ActionType.UpdateDependencies,
            dependencyInactiveElements
        });
    }

    resetedForm = () => {
        this._dispatch({
            type: ActionType.ResetedForm
        });
    }

    resetForm = (formContainer: FormContainer) => {
        this._dispatch({
            type: ActionType.ResetForm,
            formState: {
                ...initFormState(formContainer),
                isReset: true
            }
        });
    }

    updateFocusOn = (focusOn: string) => {
        this._dispatch({
            type: ActionType.UpdateFocusOn,
            focusOn
        });
    }

    updateIdentity = (identityInfo?: IdentityInfo) => {
        this._dispatch({
            type: ActionType.UpdateIdentityInfo,
            identityInfo
        });
    }

    updateSubmissionKey = (submissionKey?: string) => {
        this._dispatch({
            type: ActionType.UpdateSubmissionKey,
            submissionKey
        });
    }

    updateCurrentStepIndex = (currentStepIndex?: number) => {
        this._dispatch({
            type: ActionType.UpdateCurrentStepIndex,
            currentStepIndex
        });
    }

    updateIsSubmitting = (isSubmitting?: boolean) => {
        this._dispatch({
            type: ActionType.UpdateIsSubmitting,
            isSubmitting
        });
    }
}