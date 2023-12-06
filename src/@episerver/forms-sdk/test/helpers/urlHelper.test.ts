import * as urlHelper from "../../src/helpers/urlHelper";

describe("Test extractParams function",()=>{
    test('Path is /sv then language should be sv', () => {
        expect(urlHelper.extractParams("/sv")).toHaveProperty("language","sv");
    });

    test('Path is /sv then relativePath should be /sv', () => {
        expect(urlHelper.extractParams("/sv")).toHaveProperty("relativePath","/sv");
    });

    test('Path is / then language should be en by default', () => {
        expect(urlHelper.extractParams("/")).toHaveProperty("language","en");
    });

    test('Path is / then relativePath should be /en by default', () => {
        expect(urlHelper.extractParams("/")).toHaveProperty("relativePath","/en");
    });
});