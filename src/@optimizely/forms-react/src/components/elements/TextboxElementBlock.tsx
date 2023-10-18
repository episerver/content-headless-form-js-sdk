import { Textbox } from "@optimizely/forms-sdk";
import React, { useRef} from "react";
import { ValidatorType } from "../../models";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";

export interface TextboxElementBlockProps {
    element: Textbox
}

export const TextboxElementBlock = (props: TextboxElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur, checkVisible } = useElement(element);
    
    const isRequire = element.properties.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = element.properties.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass}`, "");
    
    const extraAttr = useRef<any>({});
    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }
    if(element.properties.descripton && element.properties.descripton.trim() !== ""){
        extraAttr.current = {...extraAttr.current, title: element.properties.descripton }
    }
    if(element.properties.forms_ExternalSystemsFieldMappings?.length > 0){
        extraAttr.current = {...extraAttr.current, list: `${element.key}_datalist` }
    }

    return (
        <ElementWrapper className={`FormTextbox ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            <input name={element.key} id={element.key} type="text" className="FormTextbox__Input" 
                aria-describedby={`${element.key}_desc`}
                placeholder={element.properties.placeHolder}
                value={elementContext.submissionValue}
                autoComplete={element.properties.autoComplete}
                {...extraAttr.current}
                onChange={handleChange}
                onBlur={handleBlur} />
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
            {element.properties.forms_ExternalSystemsFieldMappings?.length > 0 && 
                <datalist id={`${element.key}_datalist`}>
                    {element.properties.forms_ExternalSystemsFieldMappings?.map(i => 
                        <option value={i} key={i}></option>
                    )}
                </datalist>
            }
        </ElementWrapper>
    );
}