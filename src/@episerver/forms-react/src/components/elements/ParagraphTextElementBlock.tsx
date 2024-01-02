import { FormCache, FormContainer, FormStorage, ParagraphText, Url } from "@episerver/forms-sdk"
import React, { useMemo } from "react";
import ElementWrapper from "./shared/ElementWrapper";
import { useElement } from "../../hooks/useElement";
import { ElementCaption, ValidationMessage } from "./shared";
import { useForms } from "../../context/store";

export interface ParagraphTextElementBlockProps {
    element: ParagraphText
}

export const ParagraphTextElementBlock = (props: ParagraphTextElementBlockProps) => {
    const { element } = props;
    const { elementContext } = useElement(element);
    const { isVisible, validationResults, value, validatorClasses } = elementContext;
    const formContext = useForms();
    const form = formContext?.formContainer as FormContainer
    const formKey = form.key;

    const formStorage = new FormStorage(form);
    const data = formStorage.loadFormDataFromStorage();

    const doReplaceText = element.properties.disablePlaceholdersReplacement ?? true

    function extractTextsWithFormat(inputString: string) {
        const regex = /::(.*?)::/g;
        const matches = inputString.match(regex);
        if (matches) {
            return matches.map(match => match.slice(2, -2));
        } else {
            return [];
        }
    }

    let text = element.properties.paragraphText
    const placeHolders = extractTextsWithFormat(element.properties.paragraphText)

    if (doReplaceText) {
        data.forEach(element => {
            const key = element.elementKey
            const value = element.value as string
            const friendlyName = form.formElements.find(fe => fe.key === key)?.displayName
            if (friendlyName && placeHolders.indexOf(friendlyName) !== -1) {
                text = text.replace("::" + friendlyName + "::", value)
            }
        });
    }

    return useMemo(() => (
        <ElementWrapper className={`FormParagraphText Form__Element--NonData ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <ElementCaption element={element} />
            <>
                <div id={formKey} >
                    <div dangerouslySetInnerHTML={{
                        __html: text
                    }}/>
                </div>
                <div id={formKey + "__OriginalText"} className="Form__Original__ParagraphText">

                </div>
            </>
        </ElementWrapper >
    ), [isVisible, validationResults, value]);
}