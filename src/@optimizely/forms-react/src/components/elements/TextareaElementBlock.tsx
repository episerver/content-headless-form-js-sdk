import { Textarea } from "@optimizely/forms-sdk"
import { ValidatorType } from "../../models";
import React, { useRef} from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";

export interface TextareaElementBlockProps {
    element: Textarea
}

export const TextareaElementBlock = (props: TextareaElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur, checkVisible } = useElement(element);
    
    const isRequire = element.properties.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = element.properties.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass}`, "");
    
    const extraAttr = useRef<any>({});
    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    return (
        <ElementWrapper className={`FormTextbox FormTextbox--Textarea ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            <textarea 
                name={element.key} 
                id={element.key} 
                className="FormTextbox__Input" 
                placeholder={element.properties.placeHolder}
                data-f-datainput
                {...extraAttr.current}
                aria-describedby={`${element.key}_desc`}
                value={elementContext.value as string}
                autoComplete={element.properties.autoComplete}
                onChange={handleChange}
                onBlur={handleBlur}
            >
            </textarea>
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