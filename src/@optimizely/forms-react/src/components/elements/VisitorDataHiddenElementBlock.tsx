import { VisitorDataHidden } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface VisitorDataHiddenElementBlockProps {
    element: VisitorDataHidden
}

export const VisitorDataHiddenElementBlock = (props: VisitorDataHiddenElementBlockProps) => {
    const { element } = props;
    const { elementContext, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);

    return (
        <ElementWrapper className={`Form__Element FormHidden FormHideInSummarized ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element} />

            <input
                name={element.key}
                id={element.key}
                type="hidden"
                className="Form__Element FormHidden FormHideInSummarized"
                onChange={handleChange}
                onBlur={handleBlur}
            />

            <ValidationMessage element={element} validationResults={elementContext.validationResults} />
        </ElementWrapper>
    );
}