import { InputElementBase, InputElementBaseProperties } from "./base"
/**
 *  Allow users to select from a set of images
 */
export interface ImageChoice extends InputElementBase {
    properties: ImageChoiceProperties
}

export interface ImageChoiceProperties extends InputElementBaseProperties {
    showSelectionInputControl: boolean,
    allowMultiSelect: boolean
    items: FeedImageItem[]
}

export interface FeedImageItem {
    text: string
    url: string
    target: string
    title: string
}