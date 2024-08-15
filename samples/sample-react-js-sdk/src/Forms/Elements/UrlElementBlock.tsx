import { FormSubmission, FormValidationResult, Url } from "@episerver/forms-sdk";
import { useEffect, useState } from "react";

interface UrlElementBlock {
    submissionData: FormSubmission[];
    element: Url;
    updateData: (elementKey: string, value: string) => void;
    validationResult: FormValidationResult | undefined;
}

const UrlElementBlock: React.FC<UrlElementBlock> = ({ element, updateData, validationResult, submissionData }) => {
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
            updateData(element.key,element.properties.predefinedValue ?? "")
            setValue(element.properties.predefinedValue ?? "")
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
            {/* Label*/}
            <label htmlFor={element.key} className="Form__Element__Caption">
                {element.properties.label}
            </label>
            {/* Input field */}
            <input
                name={element.key}
                id={element.key}
                placeholder={element.properties.placeHolder}
                key={element.key}
                type="url"
                className= {`${validationClassName} FormTextbox__Input`}
                onChange={(e) => updateData(element.key, e.target.value)}
                value={value}
            />
            {/* Error message displayed when validation fails*/}
            <p className="FormElement_Error_Message">{validationMessage}</p>
        </>
    );
};

export default UrlElementBlock;
