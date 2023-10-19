import { Range } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface RangeElementBlockProps {
    element: Range
}

export const RangeElementBlock = (props: RangeElementBlockProps) => {
    const { element } = props;
    const { elementContext, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);

    const handleDecrement = () => {
        handleChange({
            target: {
                name: element.key,
                value:  parseInt(elementContext.value) - element.properties.step,
                type: "range",
            }
        })
    }

    const handleIncrement = () => {
        handleChange({
            target: {
                name: element.key,
                value: parseInt(elementContext.value) + element.properties.step,
                type: "range",
            }
        })
    }

    return (
        <ElementWrapper className={`FormRange ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <ElementCaption element={element} />
            <span className="FormRange__Wrapper">
                <span className="FormRange__Slider__Wrapper">
                    {elementContext.value > element.properties.min ?
                        <button className="FormRange__Slider__Button" type="button" aria-label="@decrement" title="@decrement" data-action="decrement" onClick={handleDecrement}>&lt;</button>
                        :
                        <button className="FormRange__Slider__Button FormRange__Slider__Button__Disable" type="button" aria-label="@decrement" title="@decrement" data-action="decrement">&lt;</button>
                    }
                    <span className="FormRange__Min">{element.properties.min}</span>
                    <input
                        name={element.key}
                        id={element.key}
                        type="range"
                        className="FormRange__Input"
                        value={elementContext.value}
                        min={element.properties.min}
                        max={element.properties.max}
                        step={element.properties.step}
                        aria-valuemin={element.properties.min}
                        aria-valuemax={element.properties.max}
                        aria-valuenow={elementContext.value}
                        aria-valuetext={elementContext.value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <span className="FormRange__Max">{element.properties.max}</span>
                    {elementContext.value < element.properties.max ?
                        <button className="FormRange__Slider__Button" type="button" aria-label="@increment" title="@increment" data-action="increment" onClick={handleIncrement}>&gt;</button>
                        :
                        <button className="FormRange__Slider__Button FormRange__Slider__Button__Disable" type="button" aria-label="@increment" title="@increment" data-action="increment">&gt;</button>
                    }
                </span>
                <span className="FormRange__Output__Wrapper">
                    <output htmlFor={element.key} className="FormRange__Output">{elementContext.value}</output>
                </span>
            </span>
            <ValidationMessage element={element} validationResults={elementContext.validationResults} />
        </ElementWrapper>
    );
}