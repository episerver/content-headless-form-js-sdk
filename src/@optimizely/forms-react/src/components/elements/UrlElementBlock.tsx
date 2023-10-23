import { Url } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface UrlElementBlockProps {
    element: Url
}

export const UrlElementBlock = (props: UrlElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);

    return (
        <ElementWrapper className={`FormTextbox__Input FormUrl__Input ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element} />

            <input
                name={element.key}
                id={element.key}
                type="url"
                placeholder={element.properties.placeHolder}
                value={elementContext.value}
                {...extraAttr}
                aria-describedby={`${element.key}_desc`}
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <ValidationMessage element={element} validationResults={elementContext.validationResults} />
        </ElementWrapper>
    );
}