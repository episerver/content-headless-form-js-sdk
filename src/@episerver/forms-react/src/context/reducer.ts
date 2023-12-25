import { equals,
  FormState, 
  FormSubmission, 
  FormValidationResult } from "@episerver/forms-sdk";

export enum ActionType {
    UpdateValue = "UpdateValue",
    UpdateValidation = "UpdateValidation",
    UpdateDependencies = "UpdateDependencies",
    ResetForm = "ResetForm",
    ResetedForm = "ResetedForm",
    UpdateAllValidation = "UpdateAllValidation",
    UpdateFocusOn = "UpdateFocusOn",
    UpdateIdentityInfo = "UpdateIdentityInfo",
    UpdateSubmissionKey = "UpdateSubmissionKey",
    UpdateCurrentStepIndex = "UpdateCurrentStepIndex",
    UpdateIsSubmitting = "UpdateIsSubmitting"
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
                result: action.validationResult
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
        return {
          ...formState,
          ...action.formState
        };
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
      case ActionType.UpdateIdentityInfo: {
        return {
          ...formState,
          identityInfo: action.identityInfo
        } as FormState;
      }
      case ActionType.UpdateSubmissionKey: {
        return {
          ...formState,
          submissionKey: action.submissionKey
        } as FormState
      }
      case ActionType.UpdateCurrentStepIndex: {
        return {
          ...formState,
          currentStepIndex: action.currentStepIndex
        } as FormState
      }
      case ActionType.UpdateIsSubmitting: {
        return {
          ...formState,
          isSubmitting: action.isSubmitting
        } as FormState
      }
      default: {
        return formState;
      }
    }
  }