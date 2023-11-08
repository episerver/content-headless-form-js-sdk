import { ConditionProperties, 
    FormContainer, 
    ValidatableElementBaseProperties, 
    getDefaultValue, 
    isNull,
    FormState, 
    FormSubmission, 
    FormValidation, 
    FormValidationResult, 
    FormDependencies, 
    StepDependencies } from "@optimizely/forms-sdk";

interface InitStateProps{
    formContainer: FormContainer | undefined
}

export function initState(props: InitStateProps): FormState{
    const { formContainer } = props;
    
    let formSubmissions = [] as FormSubmission[];
    let formValidations = [] as FormValidation[];
    let formDependencies = [] as FormDependencies[];
    let stepDependencies = [] as StepDependencies[];

    formContainer?.steps.forEach(s => {
        s.elements.forEach(e => {
            //init form submission
            formSubmissions =  formSubmissions.concat({ elementKey: e.key, value: getDefaultValue(e) } as FormSubmission)

            //init form validation
            let validatableProps = e.properties as ValidatableElementBaseProperties;
            let formValidationResults = [] as FormValidationResult[];

            //some elements don't have validator
            if(!isNull(validatableProps.validators))
            {
                validatableProps.validators.forEach(v => {
                    formValidationResults = formValidationResults.concat({type: v.type, valid: true}); //default valid = true to hide message
                });
            }

            formValidations = formValidations.concat({elementKey: e.key, results: formValidationResults});

            //init form dependencies
            let conditionProps = (e.properties as unknown) as ConditionProperties;

            //Captcha, ResetButton don't have condition
            if(!isNull(conditionProps.conditions)){
                conditionProps.conditions.forEach(c => {
                    formDependencies = formDependencies.concat({ elementKey: e.key, isSatisfied: false }); //default isSatisfied = false to do reverse action
                });
            }
        });
        stepDependencies = stepDependencies.concat({elementKey: s.formStep.key, isSatisfied: false });
    });



    return {
        isReset: false, formSubmissions, formDependencies, formValidations, stepDependencies, formContainer
    } as FormState;
}