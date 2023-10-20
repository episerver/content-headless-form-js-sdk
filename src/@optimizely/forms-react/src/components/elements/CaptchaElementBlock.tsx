import { Captcha } from "@optimizely/forms-sdk"
import React, { useState } from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface CaptchaElementBlockProps {
    element: Captcha
}

export const CaptchaElementBlock = (props: CaptchaElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);
    // TODO: Add image src with _formConfig.Service.CoreController + element.key
    let imageSrc = element.key

    const resetCaptcha = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        handleChange({
            target: {
                name: element.key,
                value: "",
                type: "captcha",
            }
        })
        imageSrc = element.key + "&d=" + Math.random()
    }

    return (
        <ElementWrapper className={`FormCaptcha ValidationRequired ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element}></ElementCaption>
            <button
                name="submit"
                type="submit"
                data-f-captcha-image-handler={element.key}
                value="RefreshCaptcha"
                className="FormExcludeDataRebind FormCaptcha__Refresh"
                data-f-captcha-refresh
                onClick={resetCaptcha}
            >
                {element.localizations["refreshButtonLabel"]}
            </button>
            <img
                src={imageSrc}
                alt="Alt"
                className="FormCaptcha__Image"
                data-f-captcha-image
            />
            <input
                id={element.key}
                name={element.key}
                type="text"
                className="FormTextbox__Input FormCaptcha__Input FormHideInSummarized"
                aria-describedby={`${element.key}_desc`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={elementContext.value}
            />
            <ValidationMessage element={element} validationResults={elementContext.validationResults}></ValidationMessage>
        </ElementWrapper>
    );
}