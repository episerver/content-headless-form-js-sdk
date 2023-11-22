import { equals,
  FormState, 
  FormSubmission, 
  FormValidationResult } from "@optimizely/forms-sdk";

export enum ActionType {
    UpdateValue = "UpdateValue",
    UpdateValidation = "UpdateValidation",
    UpdateDependencies = "UpdateDependencies",
    ResetForm = "ResetForm",
    ResetedForm = "ResetedForm",
    UpdateAllValidation = "UpdateAllValidation",
    UpdateFocusOn = "UpdateFocusOn"
}

export function formReducer(formState: FormState, action: any) {
    switch (action.type) {
      case ActionType.UpdateValue: {
        return {
            ...formState,
            formSubmissions: formState.formSubmissions.map(fs => equals(fs.elementKey, action.elementKey)  ? { 
                elementKey: action.elementKey, 
                value: action.value 
            } as FormSubmission : fs)
        } as FormState;
      }
      case ActionType.UpdateValidation: {
        return {
            ...formState,
            formValidationResults: formState.formValidationResults.map(fv => equals(fv.elementKey, action.elementKey) ? {
                elementKey: action.elementKey,
                results: action.validationResults
            } as FormValidationResult : fv)
        } as FormState;
      }
      case ActionType.UpdateAllValidation: {
        return {
          ...formState,
          formValidationResults: action.formValidationResults
      } as FormState;
      }
      case ActionType.UpdateDependencies: {
        return {
            ...formState,
            dependencyInactiveElements: action.dependencyInactiveElements
        } as FormState;
      }
      case ActionType.ResetForm: {
        return action.formState;
      }
      case ActionType.ResetedForm: {
        return {
          ...formState,
          isReset: false
        } as FormState;
      }
      case ActionType.UpdateFocusOn: {
        return {
          ...formState,
          focusOn: action.focusOn
        } as FormState;
      }
      default: {
        return formState;
      }
    }
  }