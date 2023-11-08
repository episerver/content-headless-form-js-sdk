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
    //functions
    equals, 
    getDefaultValue, 
    isNull, 
    isNullOrEmpty,
    isInArray,
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

    //build element state
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

    //init element state
    useEffect(()=>{
        setElementContext({
            ...elementContext,
            value,
            defaultValue,
            validationResults,
            isDependenciesSatisfied
        } as ElementContext);
    },[element.key]);

    const dispatchUpdateValidation = (validationResults: FormValidationResult[]) => {
        dispatch({
            type: ActionType.UpdateValidation,
            elementKey: element.key,
            validationResults
        });
    }
    const dispatchUpdateValue = (value: any) => {
        dispatch({
            type: ActionType.UpdateValue,
            elementKey: element.key,
            value
        });
    }
    
    const handleChange = (e: any) => {
        const {name, value, type, checked, files} = e.target;
        let submissionValue = value;
        let validationResults = [...elementContext.validationResults];

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
        
        if(/file/.test(type)){
            submissionValue = files;
            validationResults = doValidate(name, files);
            dispatchUpdateValidation(validationResults);
        }

        //update form context
        dispatchUpdateValue(submissionValue);

        //update element state
        setElementContext({
            ...elementContext, 
            value: submissionValue,
            validationResults
        } as ElementContext);
    }

    const handleBlur = (e: any) => {
        const {name} = e.target;
        //call validation from form-sdk
        let validationResults = doValidate(name, elementContext.value);

        //call dependencies from form-sdk

        //update form context
        dispatchUpdateValidation(validationResults);

        //update element state
        setElementContext({
            ...elementContext, 
            validationResults
        } as ElementContext);
    }

    const doValidate = (elementKey: string, value: any) => {
        let validationResults = formValidation.validate(value);

        let isValidationFail = !isNull(validationResults) && validationResults.some(r => !r.valid);
        let arrClass = validatorClasses.current.split(" ");
        let failClass = "ValidationFail";
        if(isValidationFail){
            if(!isInArray(failClass, arrClass)){
                arrClass.push(failClass);
            }
        }
        else {
            if(isInArray(failClass, arrClass)){
                arrClass = arrClass.filter(c => c !== failClass);
            }
        }
        validatorClasses.current = arrClass.join(" ");

        return validationResults;
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