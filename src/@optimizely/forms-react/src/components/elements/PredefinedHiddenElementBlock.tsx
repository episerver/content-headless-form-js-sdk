import { PredefinedHidden } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";

export interface PredefinedHiddenElementBlockProps {
    element: PredefinedHidden
}

export const PredefinedHiddenElementBlock = (props: PredefinedHiddenElementBlockProps) => {
    const { element } = props;
    const { elementContext, checkVisible } = useElement(element);

    return (
        <ElementWrapper className={`Form__Element FormHidden FormHideInSummarized`} isVisible={checkVisible()}>
            <input
                value={elementContext.value}
                name={element.key}
                id={element.key}
                type="hidden"
            />
        </ElementWrapper>
    );
}