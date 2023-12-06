import { ConditionProperties } from "../conditions/ConditionProperties";
import {ValidatableElementBase, ValidatableElementBaseProperties} from "./base/ValidatableElementBase";
/**
 * Allow user to select file(s) to be included as part of a form submission
 */
export interface FileUpload extends ValidatableElementBase {
    properties: FileUploadProperties
}

export interface FileUploadProperties extends ValidatableElementBaseProperties, ConditionProperties{
    allowMultiple: boolean
    fileTypes: string
    fileSize: number
    fileExtensions: string
    description: string
}