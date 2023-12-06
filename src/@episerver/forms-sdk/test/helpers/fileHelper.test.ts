import * as fileHelper from "../../src/helpers/fileHelper";

describe("Test getFileExtension function",()=>{
    test("When string of file name has extension, should return string of extension",()=>{
        let fileName = "test.jpg";
        expect(fileHelper.getFileExtension(fileName)).toEqual("jpg");
    });

    test("When string of file name has no extension, should return string empty",()=>{
        let fileName = "test";
        expect(fileHelper.getFileExtension(fileName)).toEqual("");
    });
});

describe("Test isFileValid function",()=>{
    test("When string of file name has no extension, should return false",()=>{
        let fileName = "test";
        let acceptTypes = [] as string[];
        expect(fileHelper.isFileValid(fileName, acceptTypes)).toBeFalsy();
    });

    test("When string of file name has extension but acceptTypes is empty, should return true",()=>{
        let fileName = "test.jpg";
        let acceptTypes = [] as string[];
        expect(fileHelper.isFileValid(fileName, acceptTypes)).toBeTruthy();
    });

    test("When string of file name has extension but the extension is not included in acceptTypes, should return false",()=>{
        let fileName = "test.doc";
        let acceptTypes = ["jpg", "pdf"];
        expect(fileHelper.isFileValid(fileName, acceptTypes)).toBeFalsy();
    });

    test("When string of file name has extension and the extension is included in acceptTypes, should return true",()=>{
        let fileName = "test.jpg";
        let acceptTypes = ["jpg", "pdf"];
        expect(fileHelper.isFileValid(fileName, acceptTypes)).toBeTruthy();
    });
});