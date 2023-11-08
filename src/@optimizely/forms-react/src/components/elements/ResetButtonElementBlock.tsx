import React from "react";
import { ResetButton } from "@optimizely/forms-sdk";
import { useElement } from "../../hooks/useElement";

interface ResetButtonElementBlockProps {
    element: ResetButton
}

export const ResetButtonElementBlock = (props: ResetButtonElementBlockProps) => {
    const { element } = props;
    const { extraAttr, handleReset } = useElement(element);
    
    return (
        <>
            <input 
                type="reset" 
                className="Form__Element FormResetButton Form__Element--NonData" 
                {...extraAttr}
                value={element.properties.label} 
                onClick={handleReset}
            />
        </>
    );
}