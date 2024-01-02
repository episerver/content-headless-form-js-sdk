import { ImageChoice, equals, isNullOrEmpty } from "@episerver/forms-sdk";
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ValidationMessage } from "./shared";

export interface ImageChoiceElementBlockProps {
    element: ImageChoice
}

export const ImageChoiceElementBlock = (props: ImageChoiceElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const sShouldBeVisible = element.properties.showSelectionInputControl ? "" : "visually-hidden";
    const { isVisible, validationResults, value, validatorClasses, extraAttr } = elementContext;

    return useMemo(()=>(
        <ElementWrapper className={`FormChoice FormChoice--Image ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible} extraAttr={extraAttr}>
            <fieldset aria-describedby={`${element.key}_desc`}>
                {
                    isNullOrEmpty(element.properties.label) &&
                    <legend className="Form__Element__Caption">{element.properties.label}</legend>
                }
                {element.properties.items?.map((item, index) => {
                    let isChecked = (!isNullOrEmpty(item.text)
                        && !isNullOrEmpty(value)
                        && (value).split(',').some((s: string) => equals(s, item.text))
                    );
                    var imageChoiceId = element.key + index;
                    return <label htmlFor={imageChoiceId} className="FormChoice--Image__Item" key={element.key + item.text}>
                        {
                            element.properties.allowMultiSelect ?
                                <input
                                    type="checkbox"
                                    id={imageChoiceId}
                                    name={element.key}
                                    checked={isChecked}
                                    value={item.text}
                                    className={`FormChoice__Input FormChoice__Input--Checkbox ${sShouldBeVisible}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                :
                                <input
                                    type="radio"
                                    id={imageChoiceId}
                                    name={element.key}
                                    checked={isChecked}
                                    value={item.text}
                                    className={`FormChoice__Input FormChoice__Input--Radio ${sShouldBeVisible}`}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                        }
                        <span className="FormChoice--Image__Item__Caption">{item.text}</span>
                        <img
                            src={item.url}
                            title={item.title ?? item.text}
                            alt={item.title ?? item.text} 
                        />
                    </label>;
                })}
            </fieldset>
            <ValidationMessage element={element} validationResults={validationResults} />
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}