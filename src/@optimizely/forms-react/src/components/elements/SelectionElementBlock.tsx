import { Selection, extractParams } from "@optimizely/forms-sdk"
import { ValidatorType } from "../../models";
import React, { useRef } from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";

export interface SelectionElementBlockProps {
    element: Selection
}

export const SelectionElementBlock = (props: SelectionElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur, checkVisible } = useElement(element);

    const isRequire = element.properties.validators?.some(v => v.type === ValidatorType.RequiredValidator);
    const validatorClasses = element.properties.validators?.reduce((acc, obj) => `${acc} ${obj.model.validationCssClass}`, "");

    const extraAttr = useRef<any>({});

    if (isRequire) {
        extraAttr.current = { ...extraAttr.current, required: isRequire, "aria-required": isRequire };
    }

    return (
        <ElementWrapper className={`FormSelection ${validatorClasses ?? ""}`} isVisible={checkVisible()}>
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            <select
                name={element.key}
                id={element.key}
                multiple={element.properties.allowMultiSelect}
                aria-describedby={element.displayName + "_desc"}
                autoComplete={element.properties.autoComplete}
                onChange={handleChange}
                onBlur={handleBlur}
            >
                <option disabled value={""}>
                    {element.properties.placeHolder}
                </option>
                {element.properties.items.map(feed => (
                    <option key={feed.value} value={feed.value} defaultChecked={feed.checked}>{feed.caption}</option>
                ))}
            </select>
        </ElementWrapper>
    );
}