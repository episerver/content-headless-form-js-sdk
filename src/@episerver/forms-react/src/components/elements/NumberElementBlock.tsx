import { Number } from "@episerver/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ValidationMessage, ElementCaption } from "./shared";

export interface NumberElementBlockProps {
    element: Number
}

export const NumberElementBlock = (props: NumberElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const { isVisible, validationResults, value, extraAttr, validatorClasses, elementRef } = elementContext;

    return useMemo(()=>(
        <ElementWrapper className={`FormTextbox FormTextbox--Number ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <div lang={element.locale}>
                <ElementCaption element={element} />
                
                <input
                    name={element.key}
                    id={element.key}
                    type="number"
                    step="any"
                    placeholder={element.properties.placeHolder}
                    {...extraAttr}
                    value={value}
                    aria-describedby={`${element.key}_desc`}
                    autoComplete={element.properties.autoComplete}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    ref={elementRef}
                />
                
                <ValidationMessage element={element} validationResults={validationResults} />
            </div>
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}