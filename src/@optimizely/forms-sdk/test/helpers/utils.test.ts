import * as utils from "../../src/helpers/utils";

//test isNull function
describe("Test isNull function",()=>{
    test('Null object to equal true', () => {
        expect(utils.isNull(null)).toBe(true);
    });
    
    test('Not null object to equal false', () => {
        expect(utils.isNull(1)).toBe(false);
    });
});


//test isNullOrEmpty function
describe("Test isNullOrEmpty function",()=>{
    test('Null string to equal true', () => {
        let value: string | null = null;
        expect(utils.isNullOrEmpty((value as unknown) as string)).toBe(true);
    });

    test('Empty string to equal true', () => {
        let value: string = "";
        expect(utils.isNullOrEmpty(value)).toBe(true);
    });

    test('Not null or empty string to equal false', () => {
        let value: string = "test";
        expect(utils.isNullOrEmpty(value)).toBe(false);
    });
});

//test equals function
describe("Test equals function",()=>{
    test('Two different strings to equal false', () => {
        let value1: string = "value1";
        let value2: string = "value2";
        expect(utils.equals(value1, value2)).toBe(false);
    });

    test('Two same strings to equal true', () => {
        let value1: string = "test";
        let value2: string = "test";
        expect(utils.equals(value1, value2)).toBe(true);
    });

    test('Two same strings but different case sensitive to equal false', () => {
        let value1: string = "test";
        let value2: string = "Test";
        expect(utils.equals(value1, value2)).toBe(false);
    });

    test('Two same strings but different case sensitive and ignoreCase is true to equal true', () => {
        let value1: string = "test";
        let value2: string = "Test";
        expect(utils.equals(value1, value2, true)).toBe(true);
    });
});

describe("Test isMatchedReg function", ()=>{
    test("String that match the regex, should return true", ()=>{
        let regex = "^[a-zA-Z ]*$"; //text only
        let value = "test";
        expect(utils.isMatchedReg(value, regex)).toBeTruthy();
    });

    test("String that not match the regex, should return false", ()=>{
        let regex = "^[a-zA-Z ]*$"; //text only
        let value = "12345";
        expect(utils.isMatchedReg(value, regex)).toBeFalsy();
    });
});

describe("Test isNumeric function", ()=>{
    test("Value of number, should return true", ()=>{
        let value = 12;
        expect(utils.isNumeric(value)).toBeTruthy();
    });

    test("String that not a number, should return false", ()=>{
        let value = "test";
        expect(utils.isNumeric(value)).toBeFalsy();
    });
});

describe("Test isInArray function", ()=>{
    test("A string that is included in array, should return true", ()=>{
        let array = ["test","ok"];
        let value = "test";
        expect(utils.isInArray(value, array)).toBeTruthy();
    });

    test("A string that is included in array, should return true", ()=>{
        let array = ["test","ok"];
        let value = "abc";
        expect(utils.isInArray(value, array)).toBeFalsy();
    });
});