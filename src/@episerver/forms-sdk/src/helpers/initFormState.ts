import { FormCache } from "../form-cache";
import { FormStorage } from "../form-storage";
import { ElementValidationResult, FormConstants, FormContainer, FormState, FormSubmission, FormValidationResult, StepDependencies, ValidatableElementBaseProperties } from "../models";
import { getDefaultValue } from "./elementHelper";
import { equals, isNull } from "./utils";

/**
 * Function to initialize FormState object
 * @param formContainer A form container
 * @returns An object of FormState
 */
export function initFormState(formContainer: FormContainer): FormState {
    const formStorage = new FormStorage(formContainer);
    const formData = formStorage.loadFormDataFromStorage();
    const formCache = new FormCache()

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
            if (!isNull(validatableProps.validators)) {
                validatableProps.validators.forEach(v => {
                    elementValidationResults = elementValidationResults.concat({ type: v.type, valid: true }); //default valid = true to hide message
                });
            }

            formValidationResults = formValidationResults.concat({ elementKey: e.key, results: elementValidationResults });
        });
        stepDependencies = stepDependencies.concat({ elementKey: s.formStep.key, isSatisfied: false });
    });

    //binding the elements with saved data between Next/Prev navigation
    if(formData.length > 0){
        formSubmissions = formSubmissions.map(s => {
            let savedData = formData.find(d => equals(d.elementKey, s.elementKey));
            return savedData ? savedData : s;
        });
    }

    return {
        isReset: false,
        focusOn: "",
        dependencyInactiveElements: [],
        currentStepIndex: parseInt(formCache.get(FormConstants.FormCurrentStep + formContainer.key) ?? "0"),
        formSubmissions,
        formValidationResults,
        stepDependencies,
        formContainer
    } as FormState;
}