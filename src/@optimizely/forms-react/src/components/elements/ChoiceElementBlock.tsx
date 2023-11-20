import { Choice, equals, isNullOrEmpty } from "@optimizely/forms-sdk";
import React, { useMemo } from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ValidationMessage } from "./shared";

export interface ChoiceElementBlockProps {
    element: Choice
}

export const ChoiceElementBlock = (props: ChoiceElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const { isVisible, validationResults, value, validatorClasses } = elementContext;

    return useMemo(()=>(
        <ElementWrapper className={`FormChoice ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <fieldset aria-describedby={`${element.key}_desc`}>
                
                {!isNullOrEmpty(element.properties.label) && 
                    <legend className="Form__Element__Caption">{element.properties.label}</legend>
                }
                
                {element.properties.items.map((item, index) => {
                    let isChecked = (!isNullOrEmpty(item.value) 
                                        && !isNullOrEmpty(value) 
                                        && (value).split(',').some((s: string) => equals(s, item.value))
                                    );
                    let choiceId = `${element.key}_${index}`;

                    return <React.Fragment key={`${item.value}_${index}`}>
                        {element.properties.allowMultiSelect ? (
                            <div>
                                <input type="checkbox" 
                                    id={choiceId} 
                                    name={element.key} 
                                    value={item.value} 
                                    className="FormChoice__Input FormChoice__Input--Checkbox" 
                                    checked={isChecked} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}/>
                                <label htmlFor={choiceId} className="FormChoice__Label">
                                    {item.caption}
                                </label>
                            </div>
                        ) : (
                            <div>
                                <input type="radio" 
                                    id={choiceId} 
                                    name={element.key} 
                                    value={item.value} 
                                    className="FormChoice__Input FormChoice__Input--Radio" 
                                    checked={isChecked} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}/>
                                <label htmlFor={choiceId} className="FormChoice__Label">
                                    {item.caption}
                                </label>
                            </div>
                        )}
                    </React.Fragment>;
                })}
            </fieldset>

            <ValidationMessage element={element} validationResults={validationResults} />
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}