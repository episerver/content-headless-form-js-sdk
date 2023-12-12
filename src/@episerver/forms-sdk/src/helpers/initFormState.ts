import { FormStorage } from "../form-storage";
import { ElementValidationResult, FormContainer, FormState, FormSubmission, FormValidationResult, StepDependencies, ValidatableElementBaseProperties } from "../models";
import { getDefaultValue } from "./elementHelper";
import { isNull } from "./utils";

/**
 * Function to initialize FormState object
 * @param formContainer A form container
 * @returns An object of FormState
 */
export function initFormState(formContainer: FormContainer): FormState{
    const formStorage = new FormStorage(formContainer);
    const formData = formStorage.loadFormDataFromStorage();
    
    let formSubmissions = [] as FormSubmission[];
    let formValidationResults = [] as FormValidationResult[];
    let stepDependencies = [] as StepDependencies[];

    formContainer.steps?.forEach(s => {
        s.elements.forEach(e => {
            //init form submission
            formSubmissions = formSubmissions.concat({ elementKey: e.key, value: getDefaultValue(e) } as FormSubmission);

            //init form validation
            let validatableProps = e.properties as ValidatableElementBaseProperties;
            let elementValidationResults = [] as ElementValidationResult[];

            //some elements don't have validator
            if(!isNull(validatableProps.validators))
            {
                validatableProps.validators.forEach(v => {
                    elementValidationResults = elementValidationResults.concat({type: v.type, valid: true}); //default valid = true to hide message
                });
            }

            formValidationResults = formValidationResults.concat({elementKey: e.key, results: elementValidationResults});
        });
        stepDependencies = stepDependencies.concat({elementKey: s.formStep.key, isSatisfied: false });
    });

    //binding the elements with stored input value between Next/Prev navigation
    if(formData.length > 0){
        formSubmissions = formData;
    }

    return {
        isReset: false, focusOn: "", dependencyInactiveElements: [], currentStepIndex: 0,
        formSubmissions, formValidationResults, stepDependencies, formContainer
    } as FormState;
}