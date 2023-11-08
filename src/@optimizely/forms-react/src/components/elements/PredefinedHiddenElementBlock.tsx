import { PredefinedHidden } from "@optimizely/forms-sdk";
import React from "react";
import { useElement } from "../../hooks/useElement";

interface PredefinedHiddenElementBlockProps {
    element: PredefinedHidden
}

export const PredefinedHiddenElementBlock = (props: PredefinedHiddenElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr } = useElement(element);

    return (
        <>
            <input 
                name={element.key} 
                id={element.key} 
                type="hidden"
                value={elementContext.value}
                className="Form__Element FormHidden FormHideInSummarized" 
                {...extraAttr} 
            />
        </>
    );
}