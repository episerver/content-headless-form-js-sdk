import {
    FormContainer, 
    ValidatableElementBaseProperties, 
    getDefaultValue, 
    isNull,
    FormState, 
    FormSubmission, 
    ElementValidationResult, 
    FormValidationResult, 
    StepDependencies } from "@optimizely/forms-sdk";

interface InitStateProps{
    formContainer: FormContainer | undefined
}

export function initState(props: InitStateProps): FormState{
    const { formContainer } = props;
    
    let formSubmissions = [] as FormSubmission[];
    let formValidationResults = [] as FormValidationResult[];
    let stepDependencies = [] as StepDependencies[];

    formContainer?.steps.forEach(s => {
        s.elements.forEach(e => {
            //init form submission
            formSubmissions =  formSubmissions.concat({ elementKey: e.key, value: getDefaultValue(e) } as FormSubmission)

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

    return {
        isReset: false, formSubmissions, formValidationResults, stepDependencies, formContainer, dependencyInactiveElements: [], focusOn: ""
    } as FormState;
}