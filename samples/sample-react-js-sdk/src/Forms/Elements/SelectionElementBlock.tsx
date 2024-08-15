import { FormSubmission, FormValidationResult, Selection, isNullOrEmpty } from "@episerver/forms-sdk";
import { useEffect, useState } from "react";

interface SelectionElementBlockProps {
    element: Selection;
    submissionData: FormSubmission[];
    updateData: (elementKey: string, value: string) => void;
    validationResult: FormValidationResult | undefined;
}

const SelectionElementBlock: React.FC<SelectionElementBlockProps> = ({ element, submissionData, updateData, validationResult }) => {
    const [validationClassName, setValidationClassName] = useState("");
    const [validationMessage, setValidationMessage] = useState("");
    const [value, setValue] = useState("")

    /** 
     * Initialize default values 
     */
    useEffect(() => {
        let formSubmissions = submissionData.find(_element => _element.elementKey === element.key);
        if (formSubmissions) {
            setValue(formSubmissions.value)
        } else {
            let predefinedValue = ""
            element.properties.items?.forEach(feed => {
                if (feed.checked) {
                    predefinedValue += feed.value + ","
                }
            });
            if (!isNullOrEmpty(predefinedValue)) {
                predefinedValue = predefinedValue.substring(0, predefinedValue.length - 1)
            } else {
                predefinedValue = ""
            }
            updateData(element.key, predefinedValue)
            setValue(predefinedValue)
        }
    }, [submissionData]);

    /** 
     * Apply appropriate class based on validation result
     */
    useEffect(() => {
        if (validationResult) {
            setValidationClassName(`${!validationResult.result.valid ? "FormElement_Error" : ""}`)
            setValidationMessage(validationResult.result.message)
        }
    }, [validationResult]);

    return (
        <>
            {/* Label */}
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            {/* Selection field */}
            <select
                className= {`${validationClassName} FormSelection__Input`}
                name={element.key}
                id={element.key}
                multiple={element.properties.allowMultiSelect}
                aria-describedby={element.displayName + "_desc"}
                autoComplete={element.properties.autoComplete}
                value={element.properties.allowMultiSelect ? value.split(",") : value}
                onChange = {(e) => updateData(element.key,e.target.value)}
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
            {/* Error message displayed when validation fails */}
            <p className="FormElement_Error_Message">{validationMessage}</p>
        </>
    )
}

export default SelectionElementBlock;