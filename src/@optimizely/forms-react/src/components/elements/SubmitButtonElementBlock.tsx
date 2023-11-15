import { SubmitButton, isNullOrEmpty } from "@optimizely/forms-sdk";
import React from "react";
import { useElement } from "../../hooks/useElement";
import ElementWrapper from "../ElementWrapper";

interface SubmitButtonElementBlockProps{
    element: SubmitButton
}

export const SubmitButtonElementBlock = (props: SubmitButtonElementBlockProps) => {
    const { element } = props;
    const { validatorClasses, extraAttr, checkVisible } = useElement(element);
    //TODO: Need to get submittable status from API
    const buttonDisableState = false;

    return (
        <ElementWrapper isVisible={checkVisible()}>
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
    );
}