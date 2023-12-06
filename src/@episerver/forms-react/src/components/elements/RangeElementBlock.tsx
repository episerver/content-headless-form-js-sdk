import { Range } from "@episerver/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface RangeElementBlockProps {
    element: Range
}

export const RangeElementBlock = (props: RangeElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const { isVisible, validationResults, value, validatorClasses } = elementContext;
    const handleDecrement = () => {
        handleChange({
            target: {
                name: element.key,
                value:  parseInt(value) - element.properties.step,
                type: "range",
            }
        })
    }

    const handleIncrement = () => {
        handleChange({
            target: {
                name: element.key,
                value: parseInt(value) + element.properties.step,
                type: "range",
            }
        })
    }

    return useMemo(()=>(
        <ElementWrapper className={`FormRange ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <ElementCaption element={element} />
            <span className="FormRange__Wrapper">
                <span className="FormRange__Slider__Wrapper">
                    {value > element.properties.min ?
                        <button className="FormRange__Slider__Button" type="button" aria-label="decrement" title="decrement" data-action="decrement" onClick={handleDecrement}>&lt;</button>
                        :
                        <button className="FormRange__Slider__Button FormRange__Slider__Button__Disable" type="button" aria-label="decrement" title="decrement" data-action="decrement">&lt;</button>
                    }
                    <span className="FormRange__Min">{element.properties.min}</span>
                    <input
                        name={element.key}
                        id={element.key}
                        type="range"
                        className="FormRange__Input"
                        value={value}
                        min={element.properties.min}
                        max={element.properties.max}
                        step={element.properties.step}
                        aria-valuemin={element.properties.min}
                        aria-valuemax={element.properties.max}
                        aria-valuenow={value}
                        aria-valuetext={value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                    <span className="FormRange__Max">{element.properties.max}</span>
                    {value < element.properties.max ?
                        <button className="FormRange__Slider__Button" type="button" aria-label="increment" title="increment" data-action="increment" onClick={handleIncrement}>&gt;</button>
                        :
                        <button className="FormRange__Slider__Button FormRange__Slider__Button__Disable" type="button" aria-label="increment" title="increment" data-action="increment">&gt;</button>
                    }
                </span>
                <span className="FormRange__Output__Wrapper">
                    <output htmlFor={element.key} className="FormRange__Output">{value}</output>
                </span>
            </span>
            <ValidationMessage element={element} validationResults={validationResults} />
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}