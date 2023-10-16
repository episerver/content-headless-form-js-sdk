import { ConditionProperties, DataElementBlockBaseProperties, FormContainer, ValidatableElementBaseProperties } from "@optimizely/forms-sdk";
import { FormState } from "../models/FormContext";
import { FormSubmission } from "../models/FormSubmission";
import { FormValidation, FormValidationResult } from "../models/FormValidation";
import { FormDependencies } from "../models/FormDependencies";
import { StepDependencies } from "../models/StepDependencies";

interface InitStateProps{
    formContainer: FormContainer
}

export function initState(props: InitStateProps): FormState{
    const { formContainer } = props;
    
    let formSubmissions = [] as FormSubmission[];
    let formValidations = [] as FormValidation[];
    let formDependencies = [] as FormDependencies[];
    let stepDependencies = [] as StepDependencies[];

    formContainer.steps.forEach(s => {
        s.elements.forEach(e => {
            //init form submission
            let dataProps = e.properties as DataElementBlockBaseProperties;
            formSubmissions =  formSubmissions.concat({ elementKey: e.key, value: dataProps.predefinedValue ?? null } as FormSubmission)

            //init form validation
            let validatableProps = e.properties as ValidatableElementBaseProperties;
            let formValidationResults = [] as FormValidationResult[];

            //some elements don't have validator
            if(validatableProps.validators)
            {
                validatableProps.validators.forEach(v => {
                    formValidationResults = formValidationResults.concat({type: v.type, valid: true}); //default valid = true to hide message
                });
            }

            formValidations = formValidations.concat({elementKey: e.key, results: formValidationResults});

            //init form dependencies
            let conditionProps = (e.properties as unknown) as ConditionProperties;

            //Captcha, ResetButton don't have condition
            if(conditionProps.conditions){
                conditionProps.conditions.forEach(c => {
                    formDependencies = formDependencies.concat({ elementKey: e.key, isSatisfied: false }); //default isSatisfied = false to do reverse action
                });
            }
        });
        stepDependencies = stepDependencies.concat({elementKey: s.formStep.key, isSatisfied: false });
    });



    return {
        formSubmissions, formDependencies, formValidations, stepDependencies
    } as FormState;
}