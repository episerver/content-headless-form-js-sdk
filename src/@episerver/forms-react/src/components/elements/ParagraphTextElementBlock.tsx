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

    function extractTextsWithFormat(inputString: string, indicator: string) {
        const regex = new RegExp(`${indicator}(.*?)${indicator}`, 'g');
        const indicatorLength = indicator.length;
        const matches = (inputString.match(regex) ?? []) as string[];
        if (matches) {
            return matches.map(match => match.slice(indicatorLength, -indicatorLength));
        } else {
            return [];
        }
    }

    let replacedText = element.properties.paragraphText ?? ""
    const indicators = ['::', "#"]

    indicators.forEach(indicator => {
        const placeHolders = extractTextsWithFormat(replacedText, indicator)
        if (doReplaceText) {
            data.forEach(element => {
                const friendlyName = form.formElements.find(fe => fe.key === element.elementKey)?.displayName

                if (friendlyName && placeHolders.indexOf(friendlyName) !== -1) {
                    replacedText = replacedText.replace(`${indicator}${friendlyName}${indicator}`, element.value as string ?? "")
                }
            });
        }
    });

    return useMemo(() => (
        <ElementWrapper className={`FormParagraphText Form__Element--NonData ${validatorClasses}`} validationResults={validationResults} isVisible={isVisible}>
            <ElementCaption element={element} />
            <>
                <div id={formKey} >
                    <div dangerouslySetInnerHTML={{
                        __html: replacedText
                    }} />
                </div>
                <div id={formKey + "__OriginalText"} className="Form__Original__ParagraphText">

                </div>
            </>
        </ElementWrapper >
    ), [isVisible, validationResults, value]);
}