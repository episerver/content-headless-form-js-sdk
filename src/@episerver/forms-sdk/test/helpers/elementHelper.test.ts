import * as elementHelper from "../../src/helpers/elementHelper";
import { DataElementBlockBase, 
    DataElementBlockBaseProperties, 
    FormElementBase, 
    SelectionBase, 
    SelectionBaseProperties } from "../../src/models";

describe("Test getDefaultValue function", ()=>{
    test("If element has no predefinedValue or autofillData, then default value is undefined", ()=>{
        let element = {} as FormElementBase;
        expect(elementHelper.getDefaultValue(element)).toBe(undefined);
    });

    test("If element has predefinedValue, then default value is predefinedValue", ()=>{
        let element = { 
            properties: {
                predefinedValue: "test"
            } as DataElementBlockBaseProperties
        } as DataElementBlockBase;
        expect(elementHelper.getDefaultValue(element)).toBe("test");
    });

    test("If element has autoFillData, then default value is the first item of autoFillData", ()=>{
        let element = { 
            properties: {
                forms_ExternalSystemsFieldMappings: ["item1", "item2"]
            } as DataElementBlockBaseProperties
        } as DataElementBlockBase;
        expect(elementHelper.getDefaultValue(element)).toBe("item1");
    });

    test("If element has autoFillData and predefinedValue, then default value is predefinedValue", ()=>{
        let element = { 
            properties: {
                predefinedValue: "test",
                forms_ExternalSystemsFieldMappings: ["item1", "item2"]
            } as DataElementBlockBaseProperties
        } as DataElementBlockBase;
        expect(elementHelper.getDefaultValue(element)).toBe("test");
    });

    test("If element is choice and has items that checked, then default value is the combined value of all items that checked", ()=>{
        let element = { 
            properties: {
                items: [{
                    checked: true,
                    caption: "1",
                    value: "1"
                }, {
                    checked: true,
                    caption: "2",
                    value: "2"
                }]
            } as SelectionBaseProperties
        } as SelectionBase;
        expect(elementHelper.getDefaultValue(element)).toBe("1,2");
    });
})