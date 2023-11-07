import { Selection, isNullOrEmpty } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface SelectionElementBlockProps {
    element: Selection
}

export const SelectionElementBlock = (props: SelectionElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);
    const defaultOptionSelected = !element.properties.allowMultiSelect && !element.properties.items.some(i => i.checked);
    return (
        <ElementWrapper className={`FormSelection ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element}></ElementCaption>
            <select
                name={element.key}
                id={element.key}
                multiple={element.properties.allowMultiSelect}
                aria-describedby={element.displayName + "_desc"}
                {...extraAttr}
                autoComplete={element.properties.autoComplete}
                onChange={handleChange}
                onBlur={handleBlur}
            >
                <option disabled selected={defaultOptionSelected} value="">
                    {isNullOrEmpty(element.properties.placeHolder) 
                        ? element.localizations["selectionDefaultPlaceholder"]
                        : element.properties.placeHolder
                    }
                </option>
                {element.properties.items.map(feed => (
                    <option key={feed.value} value={feed.value} defaultChecked={feed.checked}>{feed.caption}</option>
                ))}
            </select>
            <ValidationMessage element={element} validationResults={elementContext.validationResults}></ValidationMessage>
        </ElementWrapper>
    );
}