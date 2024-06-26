import { Url } from "@episerver/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface UrlElementBlockProps {
    element: Url
}

export const UrlElementBlock = (props: UrlElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const { isVisible, validationResults, value, extraAttr, validatorClasses, elementRef } = elementContext;
    return useMemo(()=>(
        <ElementWrapper className={`FormTextbox__Input FormUrl__Input ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <ElementCaption element={element} />

            <input
                name={element.key}
                id={element.key}
                type="url"
                placeholder={element.properties.placeHolder}
                value={value}
                {...extraAttr}
                aria-describedby={`${element.key}_desc`}
                onChange={handleChange}
                onBlur={handleBlur}
                ref={elementRef}
            />

            <ValidationMessage element={element} validationResults={validationResults} />
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}