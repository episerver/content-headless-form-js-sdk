import { SelectionBase, SelectionBaseProperties } from "./base"

/**
 * This element can be rendered as Combobox or Listbox, base on SelectionBase's allowMultiSelect property
 */
export interface Selection extends SelectionBase {
    properties: SelectionProperties
}

export interface SelectionProperties extends SelectionBaseProperties {
    autoComplete: string
}