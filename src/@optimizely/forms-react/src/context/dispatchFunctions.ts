import { FormContainer, ElementValidationResult, FormValidationResult } from "@optimizely/forms-sdk";
import { ActionType } from "./reducer";
import { initState } from "./initState";

export class DispatchFunctions {
    readonly _dispatch: any
    constructor(dispatch: any){
        this._dispatch = dispatch;
    }

    dispatchUpdateValidation = (elementKey: string, validationResults: ElementValidationResult[]) => {
        this._dispatch({
            type: ActionType.UpdateValidation,
            elementKey: elementKey,
            validationResults
        });
    }

    dispatchUpdateAllValidation = (formValidationResults: FormValidationResult[]) => {
        this._dispatch({
            type: ActionType.UpdateAllValidation,
            formValidationResults
        });
    }

    dispatchUpdateValue = (elementKey: string, value: any) => {
        this._dispatch({
            type: ActionType.UpdateValue,
            elementKey: elementKey,
            value
        });
    }

    dispatchUpdateDependencies = (dependencyInactiveElements: string[]) => {
        this._dispatch({
            type: ActionType.UpdateDependencies,
            dependencyInactiveElements
        });
    }

    dispatchResetedForm = () => {
        this._dispatch({
            type: ActionType.ResetedForm
        });
    }

    dispatchResetForm = (formContainer: FormContainer | undefined) => {
        this._dispatch({
            type: ActionType.ResetForm,
            formState: {
                ...initState({formContainer}),
                isReset: true
            }
        });
    }

    dispatchFocusOn = (focusOn: string) => {
        this._dispatch({
            type: ActionType.UpdateFocusOn,
            focusOn
        });
    }
}