import { FileUpload } from "@optimizely/forms-sdk"
import React from "react";
import ElementWrapper from "../ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";

export interface FileUploadElementBlockProps {
    element: FileUpload
}

export const FileUploadElementBlock = (props: FileUploadElementBlockProps) => {
    const { element } = props;
    const { elementContext, extraAttr, validatorClasses, handleChange, handleBlur, checkVisible } = useElement(element);
    let allowedTypes = ""
    element.properties.fileTypes.split(",").forEach(ext => {
        allowedTypes += "." + ext + ","
    });
    return (
        <ElementWrapper className={`FormFileUpload ${validatorClasses}`} isVisible={checkVisible()}>
            <ElementCaption element={element} />

            <input
                name={element.key}
                id={element.key}
                type="file"
                {...extraAttr}
                multiple={element.properties.allowMultiple}
                className="FormFileUpload__Input"
                accept={allowedTypes}
                aria-describedby={element.displayName + "_desc"}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            <div className="FormFileUpload__PostedFile"></div>

            <ValidationMessage element={element} validationResults={elementContext.validationResults} />
        </ElementWrapper>
    );
}