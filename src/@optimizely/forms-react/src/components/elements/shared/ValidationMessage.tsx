import { ValidatableElementBase, FormValidationResult, isNull } from "@optimizely/forms-sdk";
import React from "react";

interface ValidationMessageProps {
    element: ValidatableElementBase,
    validationResults: FormValidationResult[]
}

export const ValidationMessage = (props: ValidationMessageProps) => {
    const { element, validationResults } = props;
    
    return (
        <>
            {element.properties.validators?.map((v, i)=> {
                let valid = isNull(validationResults) || validationResults.length === 0 || isNull(validationResults[i]?.valid) || validationResults[i].valid;
                return (
                    <span key={v.type} className="Form__Element__ValidationError" id={`${element.key}_desc`} role="alert" 
                        style={{display: valid ? "none" : ""}}>
                            {v.model.message}
                    </span>
                );
            })}
        </>
    );
}