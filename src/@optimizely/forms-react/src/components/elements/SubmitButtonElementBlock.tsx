import { SubmitButton, isNullOrEmpty } from "@optimizely/forms-sdk";
import React, { useMemo } from "react";
import { useElement } from "../../hooks/useElement";
import ElementWrapper from "./shared/ElementWrapper";

interface SubmitButtonElementBlockProps{
    element: SubmitButton
}

export const SubmitButtonElementBlock = (props: SubmitButtonElementBlockProps) => {
    const { element } = props;
    const { elementContext } = useElement(element);
    const { isVisible, extraAttr, validatorClasses } = elementContext;
    //TODO: Need to get submittable status from API
    const buttonDisableState = false;

    return useMemo(()=>(
        <ElementWrapper isVisible={isVisible}>
            <button id={element.key}
                name="submit"
                type="submit"
                value={element.key}
                {...extraAttr}
                disabled={buttonDisableState}
                className={isNullOrEmpty(element.properties.image) 
                    ? `Form__Element FormExcludeDataRebind FormSubmitButton ${validatorClasses}` 
                    : `Form__Element FormExcludeDataRebind FormSubmitButton FormImageSubmitButton ${validatorClasses}`
                }
            >
                {isNullOrEmpty(element.properties.image) ? element.properties.label : (
                    <img src={element.properties.image} alt={element.properties.label} />
                )}
            </button>
        </ElementWrapper>
    ),[isVisible]);
}