import { useEffect, useRef, useState } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { ActionType } from "../context/reducer";
import { 
    //models
    ConditionProperties, 
    DataElementBlockBaseProperties, 
    FormElementBase, 
    ValidatableElementBaseProperties, 
    ValidatorType,
    SatisfiedActionType,
    FormValidationResult,
    FormSubmission,
    FormValidation,
    FormDependencies,
    //functions
    equals, 
    getDefaultValue, 
    isNull, 
    isNullOrEmpty, 
    //class
    FormValidator
    } from "@optimizely/forms-sdk";

export interface ElementContext{
    value: any,
    defaultValue: any,
    isDependenciesSatisfied: boolean
    validationResults: FormValidationResult[]
}

export const useElement = (element: FormElementBase) => {
    const formContext = useForms();
    const dispatch = useFormsDispatch();
    const extraAttr = useRef<any>({});
    const formValidation = new FormValidator(element);
    const defaultValue = getDefaultValue(element);

    //build element context
    const value = (formContext?.formSubmissions ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.value ?? defaultValue;
    const validationResults = (formContext?.formValidations ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.results ?? [];
    const isDependenciesSatisfied = (formContext?.formDependencies ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.isSatisfied ?? false;

    const [elementContext, setElementContext] = useState<ElementContext>({ value } as ElementContext);

    //build extra attributes for element
    const validatableProps = (element.properties as unknown) as ValidatableElementBaseProperties;
    const isRequire = validatableProps.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = useRef<string>(validatableProps.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass ?? ""}`, "") ?? "");

    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    if(!isNullOrEmpty(element.properties.description)){
        extraAttr.current = {...extraAttr.current, title: element.properties.description }
    }

    const dataProps = element.properties as DataElementBlockBaseProperties;
    if(dataProps.forms_ExternalSystemsFieldMappings?.length > 0){
        extraAttr.current = {...extraAttr.current, list: `${element.key}_datalist` }
    }

    //init element context
    useEffect(()=>{
        setElementContext({
            ...elementContext,
            value,
            defaultValue,
            validationResults,
            isDependenciesSatisfied
        } as ElementContext);
    },[element.key]);
    
    const handleChange = (e: any) => {
        const {name, value, type, checked} = e.target;
        let submissionValue = value;

        //get selected value for choice
        if(/checkbox|radio/.test(type)){
            let arrayValue = isNull(elementContext.value) || /radio/.test(type) 
                ? [] 
                : (elementContext.value as string).split(",");

            if(checked) {
                arrayValue.push(value);
            }
            else {
                arrayValue = arrayValue.filter(v => !equals(v, value));
            }

            submissionValue = arrayValue.length > 0 ? arrayValue.join(",") : null;
        }

        //update form context
        dispatch({
            type: ActionType.UpdateValue,
            elementKey: name,
            value: submissionValue
        });

        //update element context
        setElementContext({
            ...elementContext, 
            value: submissionValue
        } as ElementContext);
    }
    const handleBlur = (e: any) => {
        const {name} = e.target;
        //call validation from form-sdk
        doValidate(name);

        //call dependencies from form-sdk
    }

    const doValidate = (elementKey: string) => {
        let validationResults = formValidation.validate(elementContext.value);

        //update form context
        dispatch({
            type: ActionType.UpdateValidation,
            elementKey,
            validationResults
        });

        //update element context
        setElementContext({
            ...elementContext, 
            validationResults
        } as ElementContext);

        let isValidationFail = !isNull(validationResults) && validationResults.some(r => !r.valid);
        validatorClasses.current = `${isValidationFail ? "ValidationFail" : ""} ${validatorClasses.current}`
    }

    const checkVisible = (): boolean => {
        const conditionProps = (element.properties as unknown) as ConditionProperties;
        if(isNull(conditionProps.satisfiedAction) 
            || isNull(elementContext.isDependenciesSatisfied)){
            return true;
        }

        if(elementContext.isDependenciesSatisfied) {
            //if isDependenciesSatisfied = true, and if SatisfiedAction = show, then show element. otherwise hide element.
            return equals(conditionProps.satisfiedAction, SatisfiedActionType.Show);
        }
        else {
            //if isDependenciesSatisfied = false, and if SatisfiedAction = hide, then show element. otherwise hide element.
            return equals(conditionProps.satisfiedAction, SatisfiedActionType.Hide);
        }
    }

    return { elementContext, extraAttr: extraAttr.current, validatorClasses: validatorClasses.current, handleChange, handleBlur, checkVisible };
}