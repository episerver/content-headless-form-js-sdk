import { ValidatableElementBase, FormValidationResult } from "@episerver/forms-sdk";
import React from "react";

interface ValidationMessageProps {
    element: ValidatableElementBase,
    validationResults: FormValidationResult
}

export const ValidationMessage = (props: ValidationMessageProps) => {
    const { validationResults } = props;
    
    return (
        <>
            <span className="Form__Element__ValidationError" 
                id={`${validationResults.elementKey}_desc`} 
                role="alert" 
                style={{display: validationResults.result.valid ? "none" : ""}}
            >
                    {validationResults.result.message}
            </span>
        </>
    );
}