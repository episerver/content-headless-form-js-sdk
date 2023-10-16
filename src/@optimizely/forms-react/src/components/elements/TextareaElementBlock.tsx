import { Textarea } from "@optimizely/forms-sdk"
import { FormValidationModel } from "../../models/FormValidationModel";
import { ValidatorType } from "../../models";
import React, { useRef} from "react";
import ElementWrapper from "../ElementWrapper";

export interface TextareaElementBlockProps {
    element: Textarea
}

export const TextareaElementBlock = (props: TextareaElementBlockProps) => {
    const {element} = props;
    const formContext = {} as Record<string, object>;
    const formValidationContext = {} as Record<string, FormValidationModel[]>;
    const handleChange = () => {}; //TODO: update data to context
    const handleBlur = () => {}; //TODO: validation, dependency

    const isRequire = element.properties.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = element.properties.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass}`, "");

    const extraAttr = useRef<any>({});
    if(isRequire){
        extraAttr.current = {...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    return (
        <ElementWrapper className={`FormTextbox ${validatorClasses ?? ""}`} isVisible={true}>
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            <textarea 
                name="{element.key}" 
                id={element.key} 
                className="FormTextbox__Input" 
                placeholder={element.properties.placeHolder}
                data-f-label="@labelText" 
                data-f-datainput
                aria-describedby={`${element.key}_desc`}
                value={formContext[element.key]}
                autoComplete={element.properties.autoComplete}
                onChange={handleChange}
                onBlur={handleBlur}
            >
            </textarea>
            {element.properties.validators?.map((v)=> {
                let validationResult = formValidationContext[element.key]?.filter(r => r.type == v.type);
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