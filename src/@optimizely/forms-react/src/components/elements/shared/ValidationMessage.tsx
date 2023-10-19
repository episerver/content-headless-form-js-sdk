import { ValidatableElementBase } from "@optimizely/forms-sdk";
import React from "react";
import { FormValidationResult } from "../../../models/FormValidation";

interface ValidationMessageProps {
    element: ValidatableElementBase,
    validationResults: FormValidationResult[]
}

export const ValidationMessage = (props: ValidationMessageProps) => {
    const { element, validationResults } = props;
    
    return <>
        {element.properties.validators?.map((v)=> {
            let valid = !validationResults || validationResults?.length == 0 || validationResults[0].valid;
            return (
                <span key={v.type} className="Form__Element__ValidationError" id={`${element.key}_desc`} role="alert" 
                    style={{display: valid ? "none" : ""}}>
                        {v.model.message}
                </span>
            );
        })}
    </>;
}