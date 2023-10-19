import { useEffect, useState } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormValidationResult } from "../models/FormValidation";
import { ActionType } from "../context/reducer";
import { ConditionProperties, FormElementBase, equals, getDefaultValue, isNull } from "@optimizely/forms-sdk";
import { SatisfiedActionType } from "../models/SatisfiedActionType";

export interface ElementContext{
    value: any,
    defaultValue: any,
    isDependenciesSatisfied: boolean
    validationResults: FormValidationResult[]
}

export const useElement = (element: FormElementBase) => {
    const formContext = useForms();
    const dispatch = useFormsDispatch();

    const defaultValue = getDefaultValue(element);

    const value = (formContext?.formSubmissions ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.value ?? null;
    const validationResults = (formContext?.formValidations ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.results ?? [];
    const isDependenciesSatisfied = (formContext?.formDependencies ?? [])
                    .filter(s => equals(s.elementKey, element.key))[0]?.isSatisfied ?? false;

    const [elementContext, setElementContext] = useState<ElementContext>({ value } as ElementContext);

    //build extra attributes for element
    const validatableProps = (element.properties as unknown) as ValidatableElementBaseProperties;
    const isRequire = validatableProps.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = validatableProps.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass ?? ""}`, "") ?? "";

    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    if(!isNullOrEmpty(element.properties.descripton)){
        extraAttr.current = {...extraAttr.current, title: element.properties.descripton }
    }

    const dataProps = element.properties as DataElementBlockBaseProperties;
    if(dataProps.forms_ExternalSystemsFieldMappings?.length > 0){
        extraAttr.current = {...extraAttr.current, list: `${element.key}_datalist` }
    }

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
        //call validation from form-sdk
        //call dependencies from form-sdk
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

    return { elementContext, handleChange, handleBlur, checkVisible };
}