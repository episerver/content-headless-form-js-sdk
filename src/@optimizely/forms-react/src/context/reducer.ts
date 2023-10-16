import { FormState } from "../models/FormContext";
import { FormDependencies } from "../models/FormDependencies";
import { FormSubmission } from "../models/FormSubmission";
import { FormValidation, FormValidationResult } from "../models/FormValidation";

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
            formSubmissions: formState.formSubmissions.map(fs => fs.elementKey == action.elementKey ? { 
                elementKey: action.elementKey, 
                value: action.value 
            } as FormSubmission : fs)
        } as FormState;
      }
      case ActionType.UpdateValidation: {
        return {
            ...formState,
            formValidations: formState.formValidations.map(fv => fv.elementKey == action.elementKey ? {
                elementKey: action.elementKey,
                results: fv.results.map(r => r.type == action.validatorType ? {
                    type: action.validatorType,
                    valid: action.valid
                } as FormValidationResult : r)
            } as FormValidation : fv)
        } as FormState;
      }
      case ActionType.UpdateDependencies: {
        return {
            ...formState,
            formDependencies: formState.formDependencies.map(fd => fd.elementKey == action.elementKey ? {
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