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
describe("Test resolveRedirectUrl function", () => {
    const origin = "https://frontend.example.com";

    test('Relative redirect is resolved against an absolute baseUrl', () => {
        expect(urlHelper.resolveRedirectUrl("/globalassets/alloy-plan.jpg", "https://cms.example.com/", origin))
            .toBe("https://cms.example.com/globalassets/alloy-plan.jpg");
    });

    test('Relative redirect is resolved against the current origin when baseUrl is "/"', () => {
        expect(urlHelper.resolveRedirectUrl("/en/thank-you/", "/", origin))
            .toBe("https://frontend.example.com/en/thank-you/");
    });

    test('Relative redirect is resolved against the current origin when baseUrl is empty', () => {
        expect(urlHelper.resolveRedirectUrl("/en/thank-you/", "", origin))
            .toBe("https://frontend.example.com/en/thank-you/");
    });

    test('Relative redirect is resolved against the current origin when baseUrl is undefined', () => {
        expect(urlHelper.resolveRedirectUrl("/en/thank-you/", undefined, origin))
            .toBe("https://frontend.example.com/en/thank-you/");
    });

    test('Relative redirect is resolved against the current origin when baseUrl is invalid', () => {
        expect(urlHelper.resolveRedirectUrl("/en/thank-you/", "http://", origin))
            .toBe("https://frontend.example.com/en/thank-you/");
    });

    test('Absolute redirect is returned unchanged', () => {
        expect(urlHelper.resolveRedirectUrl("https://other.example.com/page", "https://cms.example.com/", origin))
            .toBe("https://other.example.com/page");
    });
});
