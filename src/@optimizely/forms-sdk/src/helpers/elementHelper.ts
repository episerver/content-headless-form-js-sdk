import { DataElementBlockBaseProperties, FormElementBase, SelectionProperties } from "../models";
import { isNull, isNullOrEmpty } from "./utils";

/**
 * Get a default value of element. The value can be predefinedValue, the first value of autofill data, or values of items are checked.
 * @param element The form element to get default value
 * @returns A string of default value
 */
export function getDefaultValue(element: FormElementBase): string | undefined{
    const dataProps = element.properties as DataElementBlockBaseProperties;
    const autoFillData = dataProps?.forms_ExternalSystemsFieldMappings ?? [];
    let defaultValue = !isNullOrEmpty(dataProps?.predefinedValue)
                        ? dataProps.predefinedValue 
                        : autoFillData.length > 0 
                        ? autoFillData[0] 
                        : undefined;

    //check if element is Choice
    const selectionProps = element.properties as SelectionProperties;
    if(!isNull(selectionProps?.items)){
        let selectedArr: string[] = [];
        selectionProps.items.forEach(i => i.checked && selectedArr.push(i.value));

        if(selectedArr.length > 0) {
            defaultValue = selectedArr.join(",");
        }
    }
    return defaultValue;
}