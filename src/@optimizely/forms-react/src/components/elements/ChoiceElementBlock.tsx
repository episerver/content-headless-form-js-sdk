import { Choice, equals, isNullOrEmpty } from "@optimizely/forms-sdk";
import React, { useRef} from "react";
import { ValidatorType } from "../../models";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";

export interface ChoiceElementBlockProps {
    element: Choice
}

export const ChoiceElementBlock = (props: ChoiceElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur, checkVisible } = useElement(element);
    
    const isRequire = element.properties.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = element.properties.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass}`, "");
    
    const extraAttr = useRef<any>({});
    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    return (
        <ElementWrapper className={`FormChoice ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <fieldset aria-describedby={`${element.key}_desc`}>
                
                {isNullOrEmpty(element.properties.label) && 
                    <legend className="Form__Element__Caption">{element.properties.label}</legend>
                }
                
                {element.properties.items.map((item, index) => {
                    let isChecked = (!isNullOrEmpty(item.value) 
                                        && !isNullOrEmpty(elementContext.submissionValue) 
                                        && (elementContext.submissionValue).split(',').some((s: string) => equals(s, item.value))
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

            {element.properties.validators?.map((v)=> {
                let validationResult = elementContext.validationResults;
                let valid = !validationResult || validationResult?.length == 0 || validationResult[0].valid;
                return (
                    <span key={v.type} className="Form__Element__ValidationError" id={`${element.key}_desc`} role="alert" 
                        style={{display: valid ? "none" : ""}}>
                            {v.model.message}
                    </span>
                );
            })}
        </ElementWrapper>
    );
}