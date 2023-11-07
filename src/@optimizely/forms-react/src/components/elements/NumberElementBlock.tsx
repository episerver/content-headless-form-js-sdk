import { Number } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ValidationMessage, ElementCaption } from "./shared";

export interface NumberElementBlockProps {
    element: Number
}

export const NumberElementBlock = (props: NumberElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);

    return (
        <ElementWrapper className={`FormTextbox FormTextbox--Number ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <div lang={element.locale}>
                <ElementCaption element={element} />
                
                <input
                    name={element.key}
                    id={element.key}
                    type="number"
                    step="any"
                    placeholder={element.properties.placeHolder}
                    {...extraAttr}
                    value={elementContext.value}
                    aria-describedby={`${element.key}_desc`}
                    autoComplete={element.properties.autoComplete}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                
                <ValidationMessage element={element} validationResults={elementContext.validationResults} />
            </div>
        </ElementWrapper>
    );
}