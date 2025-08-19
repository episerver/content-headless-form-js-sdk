import { SelectionBase, SelectionBaseProperties } from "./base/SelectionBase";
/**
 * This element can be rendered as Radio or Checkbox, base on SelectionBase's allowMultiSelect property
 */
export interface Choice extends SelectionBase {
    properties: ChoiceProperties
}

export interface ChoiceProperties extends SelectionBaseProperties {
    placeHolder: string
}
