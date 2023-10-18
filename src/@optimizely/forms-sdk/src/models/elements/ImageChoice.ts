import { InputElementBase, InputElementBaseProperties } from "./base"
/**
 *  Allow users to select from a set of images
 */
export interface ImageChoice extends InputElementBase {
    properties: ImageChoiceProperties
}

export interface ImageChoiceProperties extends InputElementBaseProperties {
    showSelectionInputControl: boolean
}