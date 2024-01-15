import { useEffect, useRef } from "react";
import { useForms } from "../context/store";
import {
    //models
    FormContainer,
    ConditionProperties,
    DataElementBlockBaseProperties,
    FormElementBase,
    ValidatableElementBaseProperties,
    ValidatorType,
    SatisfiedActionType,
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
    FormValidationResult,
    htmlDecodeEntities,
    } from "@episerver/forms-sdk";
import { DispatchFunctions } from "../context/dispatchFunctions";

export interface ElementContext {
    value: any,
    defaultValue: any,
    validationResults: FormValidationResult,
    extraAttr: any,
    validatorClasses: string,
    isVisible: boolean,
    elementRef: any
}

export const useElement = (element: FormElementBase) => {
    const formContext = useForms();
    const extraAttr = useRef<any>({});
    const formValidation = new FormValidator(element);
    const formCondition = new FormDependConditions(element)
    const defaultValue = getDefaultValue(element);
    const isVisible = useRef<boolean>(true);
    const dispatchFuncs = new DispatchFunctions();
    const elementRef = useRef<any>(null);

    //build element state
    const value = (formContext?.formSubmissions ?? [])
        .filter(s => equals(s.elementKey, element.key))[0]?.value ?? defaultValue ?? "";
    const validationResults = (formContext?.formValidationResults ?? [])
        .filter(s => equals(s.elementKey, element.key))[0] ?? {elementKey: element.key, result: {valid: true}};

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

    //reset form
    useEffect(()=>{
        if(formContext?.isReset){
            //update form state
            dispatchFuncs.resetFormDone();
        }
    },[formContext?.isReset]);

    //update visible
    useEffect(()=>{
        const conditionProps = (element.properties as unknown) as ConditionProperties;

        if (isNull(conditionProps.satisfiedAction)) {
            return;
        }

        //check form field dependencies
        const checkConditions = formCondition.checkConditions(formContext?.formSubmissions as FormSubmission[]);
        if (checkConditions) {
            //if isDependenciesSatisfied = true, and if SatisfiedAction = show, then show element. otherwise hide element.
            isVisible.current = equals(conditionProps.satisfiedAction, SatisfiedActionType.Show);
        }
        else {
            //if isDependenciesSatisfied = false, and if SatisfiedAction = hide, then show element. otherwise hide element.
            isVisible.current = equals(conditionProps.satisfiedAction, SatisfiedActionType.Hide);
        }

        //update form state
        let inactives = formContext?.dependencyInactiveElements ?? [];
        let needUpdate = false;
        if(isVisible.current){
            if(inactives.includes(element.key)){
                inactives = inactives.filter(ek => !equals(ek, element.key));
                needUpdate = true;
            }
        }
        else {
            if(!isInArray(element.key, inactives)){
                inactives.push(element.key);
                needUpdate = true;
            }
        }
        needUpdate && dispatchFuncs.updateDependencies(inactives);
    },[formContext?.formSubmissions]);

    //focus on element if validate fail before submitting
    useEffect(()=>{
        let focusOn = formContext?.focusOn ?? "";
        if(equals(focusOn, element.key)){
            elementRef.current && elementRef.current.focus();
            dispatchFuncs.updateFocusOn("");
        }
    },[formContext?.focusOn]);

    //disable submit button when form submitting
    useEffect(()=>{
        if(equals(element.contentType, "SubmitButtonElementBlock") && elementRef.current){
            elementRef.current.disabled = formContext?.isSubmitting ?? false;
        }
    },[formContext?.isSubmitting])

    const handleChange = (e: any) => {
        const { name, value: inputValue, type, checked, files, selectedOptions } = e.target;
        let submissionValue = inputValue;

        //get selected value for choice
        if (/checkbox|radio/.test(type)) {
            let arrayValue = isNull(value) || /radio/.test(type)
                ? []
                : (value as string).split(",");

            if (checked) {
                arrayValue.push(inputValue);
            }
            else {
                arrayValue = arrayValue.filter(v => !equals(v, inputValue));
            }

            submissionValue = arrayValue.length > 0 ? arrayValue.filter(v => !isNullOrEmpty(v)).join(",") : null;
        }

        if (/file/.test(type)) {
            submissionValue = files;
            dispatchFuncs.updateValidation(element.key, formValidation.validate(files));
        }

        if (/select-multiple/.test(type)) {
            submissionValue = Array.from(selectedOptions, (item: any) => item.value).join(",");
        }

        //update form context
        dispatchFuncs.updateValue(element.key, submissionValue);
    }

    const handleBlur = (e: any) => {
        //update form context
        dispatchFuncs.updateValidation(element.key, formValidation.validate(value));
    }

    const shouldResetForm = (resetConfirmationMessage: string) => {
        if (isNullOrEmpty(resetConfirmationMessage)) {
          return true;
        }
      
        const userConfirmed = confirm(htmlDecodeEntities(resetConfirmationMessage));
        return userConfirmed;
      };

    const handleReset = (e: any) => {
        e.preventDefault()
        const form = formContext?.formContainer ?? {} as FormContainer
        if (shouldResetForm(form.properties.resetConfirmationMessage)) {
            dispatchFuncs.resetForm(form);
        }
    }

    return { 
        elementContext: {
            value,
            defaultValue,
            validationResults,
            validatorClasses: validatorClasses.current,
            extraAttr: extraAttr.current,
            isVisible: isVisible.current,
            elementRef
        } as ElementContext, 
        handleChange, handleBlur, handleReset 
    };
}