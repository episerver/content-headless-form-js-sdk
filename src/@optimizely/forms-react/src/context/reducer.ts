import { equals,
  FormState, 
  FormDependencies, 
  FormSubmission, 
  FormValidation } from "@optimizely/forms-sdk";

export enum ActionType {
    UpdateValue = "UpdateValue",
    UpdateValidation = "UpdateValidation",
    UpdateDependencies = "UpdateDependencies"
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
            formValidations: formState.formValidations.map(fv => equals(fv.elementKey, action.elementKey) ? {
                elementKey: action.elementKey,
                results: action.validationResults
            } as FormValidation : fv)
        } as FormState;
      }
      case ActionType.UpdateDependencies: {
        return {
            ...formState,
            formDependencies: formState.formDependencies.map(fd => equals(fd.elementKey, action.elementKey) ? {
                elementKey: action.elementKey,
                isSatisfied: action.isSatisfied
            } as FormDependencies : fd)
        } as FormState;
      }
      default: {
        return formState;
      }
    }
  }