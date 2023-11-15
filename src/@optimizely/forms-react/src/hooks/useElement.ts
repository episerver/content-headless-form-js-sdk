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
    FormValidator,
    FormSubmission,
    FormDependConditions,
    } from "@optimizely/forms-sdk";
import { initState } from "../context/initState";

export interface ElementContext {
    value: any,
    defaultValue: any,
    validationResults: FormValidationResult[]
}

export const useElement = (element: FormElementBase) => {
    const formContext = useForms();
    const dispatch = useFormsDispatch();
    const extraAttr = useRef<any>({});
    const formValidation = new FormValidator(element);
    const formCondition = new FormDependConditions(element)
    const defaultValue = getDefaultValue(element);
    const failClass = "ValidationFail";

    //build element state
    const value = (formContext?.formSubmissions ?? [])
        .filter(s => equals(s.elementKey, element.key))[0]?.value ?? defaultValue ?? "";
    const validationResults = (formContext?.formValidations ?? [])
        .filter(s => equals(s.elementKey, element.key))[0]?.results ?? [];


    const [elementContext, setElementContext] = useState<ElementContext>({ value } as ElementContext);

    //build extra attributes for element
    const validatableProps = (element.properties as unknown) as ValidatableElementBaseProperties;
    const isRequire = validatableProps.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = useRef<string>(validatableProps.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass ?? ""}`, "") ?? "");

    if (isRequire) {
        extraAttr.current = { ...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    if (!isNullOrEmpty(element.properties.description)) {
        extraAttr.current = { ...extraAttr.current, title: element.properties.description }
    }

    const dataProps = element.properties as DataElementBlockBaseProperties;
    if (dataProps.forms_ExternalSystemsFieldMappings?.length > 0) {
        extraAttr.current = { ...extraAttr.current, list: `${element.key}_datalist` }
    }

    //init element state
    useEffect(() => {
        setElementContext({
            ...elementContext,
            value,
            defaultValue,
            validationResults
        } as ElementContext);
    }, [element.key]);

    //reset form
    useEffect(()=>{
        if(formContext?.isReset){
            //reset class
            validatorClasses.current = validatorClasses.current.split(" ").filter(c => c !== failClass).join(" ");
            //reset element state
            setElementContext({
                ...elementContext,
                value,
                defaultValue,
                validationResults,
            } as ElementContext);
            //update form state
            dispatch({
                type: ActionType.ResetedForm
            });
        }
    },[formContext?.isReset]);

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
        const { name, value, type, checked, files } = e.target;
        let submissionValue = value;
        let validationResults = [...elementContext.validationResults];

        //get selected value for choice
        if (/checkbox|radio/.test(type)) {
            let arrayValue = isNull(elementContext.value) || /radio/.test(type)
                ? []
                : (elementContext.value as string).split(",");

            if (checked) {
                arrayValue.push(value);
            }
            else {
                arrayValue = arrayValue.filter(v => !equals(v, value));
            }

            submissionValue = arrayValue.length > 0 ? arrayValue.join(",") : null;
        }

        if (/file/.test(type)) {
            submissionValue = files;
            validationResults = doValidate(files);
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
        const { name } = e.target;
        //call validation from form-sdk
        let validationResults = doValidate(elementContext.value);

        //call dependencies from form-sdk

        //update form context
        dispatchUpdateValidation(validationResults);

        //update element state
        setElementContext({
            ...elementContext,
            validationResults
        } as ElementContext);
    }

    const handleReset = () => {
        dispatch({
            type: ActionType.ResetForm,
            formState: {
                ...initState({formContainer: formContext?.formContainer}),
                isReset: true
            }
        });
    }

    const doValidate = (value: any) => {
        let validationResults = formValidation.validate(value);

        let isValidationFail = !isNull(validationResults) && validationResults.some(r => !r.valid);
        let arrClass = validatorClasses.current.split(" ");

        let failClass = "ValidationFail";
        if (isValidationFail) {
            if (!isInArray(failClass, arrClass)) {
                arrClass.push(failClass);
            }
        }
        else {
            if (isInArray(failClass, arrClass)) {
                arrClass = arrClass.filter(c => c !== failClass);
            }
        }

        return validationResults;
    }

    const checkVisible = (): boolean => {
        const conditionProps = (element.properties as unknown) as ConditionProperties;

        if (isNull(conditionProps.satisfiedAction)) {
            return true;
        }

        const checkConditions = formCondition.checkConditions(formContext?.formSubmissions as FormSubmission[]);
        if (checkConditions) {
            //if isDependenciesSatisfied = true, and if SatisfiedAction = show, then show element. otherwise hide element.
            return equals(conditionProps.satisfiedAction, SatisfiedActionType.Show);
        }
        else {
            //if isDependenciesSatisfied = false, and if SatisfiedAction = hide, then show element. otherwise hide element.
            return equals(conditionProps.satisfiedAction, SatisfiedActionType.Hide);
        }
    }

    return { 
        elementContext, extraAttr: extraAttr.current, validatorClasses: validatorClasses.current, 
        handleChange, handleBlur, checkVisible, handleReset 
    };
}