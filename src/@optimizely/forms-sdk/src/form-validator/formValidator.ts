import { isMatchedReg, isNull, isNullOrEmpty, isNumeric, isFileValid } from "../helpers";
import { AllowedExtensionsValidatorModel, 
    FormElementBase, 
    FormValidationResult, 
    MaxFileSizeValidationModel, 
    RegularExpressionValidatorModel, 
    ValidatableElementBaseProperties, 
    ValidatorModelBase, 
    ValidatorType } from "../models";

/**
 * Class to validate value of element by validator
 */

export class FormValidator {
    readonly _element: FormElementBase;

    constructor(element: FormElementBase) {
        this._element = element;
    }

    /**
     * Function to validate required field
     * @param value A value of field
     * @returns True or false
     */
    validateRequired(value: any): boolean{
        if (isNullOrEmpty(value)
                // for FileUpload element
                || (value && !value.length)) {
                return false;
            }
        return true;
    }

    /**
     * Function to validate a value is matched with a regex pattern
     * @param value A value of field
     * @param model A validator model
     * @returns True or false
     */
    validateRegex(value: any, model: ValidatorModelBase): boolean{
        let regexModel = model as RegularExpressionValidatorModel;
        if(isNull(regexModel?.jsPattern) 
            || isNullOrEmpty(value)){
            return true;
        }
        if(!isMatchedReg(value, regexModel.jsPattern)){
            return false;
        }

        return true;
    }

    /**
     * Function to validate extension of file uploaded
     * @param value A value of field
     * @param model A validator model
     * @returns True or false
     */
    validateFileExtension(value: any, model: ValidatorModelBase): boolean{
        if(isNullOrEmpty(value) 
            || (value instanceof Array && value.length === 0)){
                return true;
        }
        var validatorModel = model as AllowedExtensionsValidatorModel,
            files = value,
            acceptValue = validatorModel.accept,
            acceptTypes = isNullOrEmpty(acceptValue) ? [] : acceptValue.split(","),
            totalAcceptTypes = acceptTypes.length,
            totalFiles = files.length;

        // remove the DOT before checking, acceptTypes was sent from server always starts with DOT
        if (totalAcceptTypes > 0) {
            for (let i=0; i < totalAcceptTypes; i++) {
                acceptTypes[i] = acceptTypes[i].substring(1);
            }
        }

        // for simpleness, just comparing the extension, NOT cover image/*|video/*|audio/* pattern
        for (let j=0; j < totalFiles; j++) {
            if (!isFileValid(files[j].name, acceptTypes)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Function to validate size of file uploaded
     * @param value A value of field
     * @param model A validator model
     * @returns True or false
     */
    validateFileSize(value: any, model: ValidatorModelBase): boolean{
        if(isNull(value)){
            return true;
        }

        var validatorModel = model as MaxFileSizeValidationModel,
            files = value,
            totalItems = files.length,
            expectedSize = validatorModel.sizeInBytes;

        for (let i=0; i < totalItems; i++) {
            if (files[i].size > expectedSize) {
                return false;
            }
        }

        return true;
    }

    /**
     * Function to validate a number
     * @param value A value of field
     * @returns True or false
     */
    validateNumeric(value: any): boolean{
        if (isNull(value) || !isNumeric(value)) {
            return false
        }

        return true;
    }

    /**
     * Main validate function
     * @param value Value of field to validate
     * @returns An object that contains validate result
     */
    validate(value: any): FormValidationResult[]{
        let validatorProps = this._element.properties as ValidatableElementBaseProperties;
        if(isNull(validatorProps?.validators)){
            return [];
        }

        return validatorProps.validators.map((v) => {
            let valid = true;
            switch(v.type){
                case ValidatorType.CaptchaValidator:
                case ValidatorType.RequiredValidator:
                    valid = this.validateRequired(value);
                    break;
                case ValidatorType.RegularExpressionValidator:
                case ValidatorType.EmailValidator:
                case ValidatorType.UrlValidator:
                case ValidatorType.DateDDMMYYYYValidator:
                case ValidatorType.DateMMDDYYYYValidator:
                case ValidatorType.DateYYYYMMDDValidator:
                case ValidatorType.IntegerValidator:
                case ValidatorType.PositiveIntegerValidator:
                    valid = this.validateRegex(value, v.model);
                    break;
                case ValidatorType.AllowedExtensionsValidator:
                    valid = this.validateFileExtension(value, v.model);
                    break;
                case ValidatorType.MaxFileSizeValidator:
                    valid = this.validateFileSize(value, v.model);
                    break;
                case ValidatorType.NumericValidator:
                    valid = this.validateNumeric(value);
                    break;
            }

            return {
                type: v.type,
                valid
            } as FormValidationResult;
        })
    }
}