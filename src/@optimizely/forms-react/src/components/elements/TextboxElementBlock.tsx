import { Textbox } from "@optimizely/forms-sdk";
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage, DataList } from "./shared";

export interface TextboxElementBlockProps {
    element: Textbox
}

export const TextboxElementBlock = (props: TextboxElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);
    
    return (
        <ElementWrapper className={`FormTextbox ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element} />

            <input name={element.key} id={element.key} type="text" className="FormTextbox__Input" 
                aria-describedby={`${element.key}_desc`}
                placeholder={element.properties.placeHolder}
                value={elementContext.value}
                autoComplete={element.properties.autoComplete}
                {...extraAttr}
                onChange={handleChange}
                onBlur={handleBlur} 
            />

            <ValidationMessage element={element} validationResults={elementContext.validationResults} />

            <DataList element={element} />
        </ElementWrapper>
    );
}