import { FileUpload, FormContainer, FormStorage, isNullOrEmpty } from "@episerver/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";
import { useForms } from "../../context/store";

export interface FileUploadElementBlockProps {
    element: FileUpload
}

export const FileUploadElementBlock = (props: FileUploadElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleChange } = useElement(element);
    let allowedTypes = element.properties.fileTypes ? element.properties.fileTypes.split(",").map((ext) => {
        ext = ext.trim();
        return (ext[0] != ".") ? `.${ext}` : ext;
    }).join(",") : "";
    const { isVisible, validationResults, extraAttr, validatorClasses, elementRef } = elementContext;

    const formContext = useForms();
    const form = formContext?.formContainer as FormContainer;
    const formStorage = new FormStorage(form);
    const data = formStorage.loadFormDataFromStorage();
    const prevFilenames =  data.find(fe => fe.elementKey === element.key)?.prevValue

    return useMemo(()=>(
        <ElementWrapper className={`FormFileUpload ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <ElementCaption element={element} />

            <input
                name={element.key}
                id={element.key}
                type="file"
                {...extraAttr}
                multiple={element.properties.allowMultiple}
                className="FormFileUpload__Input"
                accept={allowedTypes}
                aria-describedby={element.key + "_desc"}
                onChange={handleChange}
                ref={elementRef}
            />

            <div className="FormFileUpload__PostedFile">
            (Previous posted file(s): {prevFilenames} )
            </div>

            <ValidationMessage element={element} validationResults={validationResults} />
        </ElementWrapper>
    ),[isVisible, validationResults]);
}
