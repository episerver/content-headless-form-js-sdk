import { Selection, isNullOrEmpty } from "@optimizely/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

interface SelectionElementBlockProps {
    element: Selection
}

export const SelectionElementBlock = (props: SelectionElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange, handleBlur } = useElement(element);
    const { isVisible, validationResults, value, extraAttr, validatorClasses, elementRef } = elementContext;

    return useMemo(()=>(
        <ElementWrapper className={`FormSelection ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
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
                value={value}
                ref={elementRef}
            >
                <option value="" disabled={value !== ""}>
                    {isNullOrEmpty(element.properties.placeHolder) 
                        ? element.localizations["selectionDefaultPlaceholder"]
                        : element.properties.placeHolder
                    }
                </option>
                {element.properties.items?.map(feed => (
                    <option key={feed.value} value={feed.value} defaultChecked={feed.checked}>{feed.caption}</option>
                ))}
            </select>
            <ValidationMessage element={element} validationResults={validationResults}></ValidationMessage>
        </ElementWrapper>
    ),[isVisible, validationResults, value]);
}