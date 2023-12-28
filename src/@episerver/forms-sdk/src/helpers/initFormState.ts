import { FormCache } from "../form-cache";
import { StepHelper } from "./stepHelper";
import { FormStorage } from "../form-storage";
import { FormConstants, FormContainer, FormState, FormSubmission, FormValidationResult, StepDependencies } from "../models";
import { getDefaultValue } from "./elementHelper";
import { equals, isNullOrEmpty } from "./utils";

/**
 * Function to initialize FormState object
 * @param formContainer A form container
 * @returns An object of FormState
 */
export function initFormState(formContainer: FormContainer, currentPageUrl?: string): FormState {
    const formStorage = new FormStorage(formContainer);
    const formData = formStorage.loadFormDataFromStorage();
    const formCache = new FormCache();
    const stepHelper = new StepHelper(formContainer);

    let formSubmissions = [] as FormSubmission[];
    let formValidationResults = [] as FormValidationResult[];
    let stepDependencies = [] as StepDependencies[];

    formContainer.steps?.forEach(s => {
        s.elements.forEach(e => {
            //init form submission
            formSubmissions = formSubmissions.concat({ elementKey: e.key, value: getDefaultValue(e) } as FormSubmission);

            //init form validation
            formValidationResults = formValidationResults.concat({ elementKey: e.key, result: {valid: true, message: ""} });
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

    let stepIndexCached = formCache.get(FormConstants.FormCurrentStep + formContainer.key) as string;
    let currentStepIndex = isNullOrEmpty(stepIndexCached) 
        ? stepHelper.getCurrentStepIndex(currentPageUrl)
        : parseInt(stepIndexCached);

    return {
        isReset: false,
        focusOn: "",
        dependencyInactiveElements: [],
        currentStepIndex,
        formSubmissions,
        formValidationResults,
        stepDependencies,
        formContainer
    } as FormState;
}