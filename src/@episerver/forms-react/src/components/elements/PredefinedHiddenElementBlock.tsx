import { PredefinedHidden } from "@episerver/forms-sdk";
import React from "react";
import { useElement } from "../../hooks/useElement";

interface PredefinedHiddenElementBlockProps {
    element: PredefinedHidden
}

export const PredefinedHiddenElementBlock = (props: PredefinedHiddenElementBlockProps) => {
    const { element } = props;
    const { elementContext } = useElement(element);
    const { value, extraAttr } = elementContext;
    
    return (
        <>
            <input 
                name={element.key} 
                id={element.key} 
                type="hidden"
                value={value}
                className="Form__Element FormHidden FormHideInSummarized" 
                {...extraAttr} 
            />
        </>
    );
}