import { useEffect, useState } from "react";
import { useForms, useFormsDispatch } from "../context/store";
import { FormValidationResult } from "../models/FormValidation";
import { ActionType } from "../context/reducer";
import { ConditionProperties, FormElementBase } from "@optimizely/forms-sdk";
import { SatisfiedActionType } from "../models/SatisfiedActionType";

export interface ElementContext{
    value: unknown
    isDependenciesSatisfied: boolean
    validationResults: FormValidationResult[]
}

export const useElement = (element: FormElementBase) => {
    const formContext = useForms();
    const dispatch = useFormsDispatch();
    const formSubmissions = formContext?.formSubmissions ?? [];
    const formValidations = formContext?.formValidations ?? [];
    const formDependencies = formContext?.formDependencies ?? [];
    const [elementContext, setElementContext] = useState<ElementContext>({} as ElementContext);
    
    useEffect(()=>{
        let submission = formSubmissions.filter(s => s.elementKey == element.key);
        
        if(submission.length > 0){
            setElementContext({...elementContext, value: submission[0].value});
        }
    },[element.key, formSubmissions]);

    useEffect(()=>{
        let validation = formValidations.filter(s => s.elementKey == element.key);
        
        if(validation.length > 0){
            setElementContext({...elementContext, validationResults: validation[0].results});
        }
    },[element.key, formValidations]);

    useEffect(()=>{
        let dependency = formDependencies.filter(s => s.elementKey == element.key);
        
        if(dependency.length > 0){
            setElementContext({...elementContext, isDependenciesSatisfied: dependency[0].isSatisfied});
        }
    },[element.key, formDependencies]);

    const handleChange = (e: any) => {
        const {name, value, type} = e.target;
        if(type === "checkbox"){
            dispatch({
                type: ActionType.UpdateValue,
                elementKey: name,
                value: e.target.checked
            });
        }
        else {
            dispatch({
                type: ActionType.UpdateValue,
                elementKey: name,
                value
            });
        }
    }
    const handleBlur = (e: any) => {
        //call validation from form-sdk
        //call dependencies from form-sdk
    }

    const checkVisible = (): boolean => {
        const conditionProps = (element.properties as unknown) as ConditionProperties;
        if(conditionProps.satisfiedAction === undefined 
            || elementContext.isDependenciesSatisfied === undefined){
            return true;
        }

        if(elementContext.isDependenciesSatisfied) {
            //if isDependenciesSatisfied = true, and if SatisfiedAction = show, then show element. otherwise hide element.
            return conditionProps.satisfiedAction === SatisfiedActionType.Show;
        }
        else {
            //if isDependenciesSatisfied = false, and if SatisfiedAction = hide, then show element. otherwise show element.
            return conditionProps.satisfiedAction === SatisfiedActionType.Hide;
        }
    }

    return { elementContext, handleChange, handleBlur, checkVisible };
}