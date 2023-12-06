import { FormValidator, 
    FormElementBase, 
    ValidatableElementBase, 
    ElementValidatorModelBase, 
    RegularExpressionValidatorModel,
    ValidatorType,
    AllowedExtensionsValidatorModel,
    } from "../../src";

describe("Test FormValidator class",()=>{
    let formValidator: FormValidator;
    let model: ElementValidatorModelBase;
    let element: FormElementBase;
    describe("Test validateRequired function",()=>{
        beforeAll(()=>{
            element = { 
                properties: {
                    validators: [
                        {
                            type: ValidatorType.RequiredValidator,
                        }
                    ]
                }
            } as ValidatableElementBase;
            formValidator = new FormValidator(element);
        });
        test("When value is null/undefined/emtpy, should return false",()=>{
            expect(formValidator.validateRequired(undefined)).toBeFalsy();
            expect(formValidator.validateRequired(null)).toBeFalsy();
            expect(formValidator.validateRequired("")).toBeFalsy();
        });

        test("When value is not null/undefined/emtpy, should return true",()=>{
            expect(formValidator.validateRequired(1)).toBeTruthy();
            expect(formValidator.validateRequired(["a","b"])).toBeTruthy();
            expect(formValidator.validateRequired("aa")).toBeTruthy();
        });

        test("When validator type is RequiredValidator, validateRequired should be called",()=>{
            const spy = jest.spyOn(formValidator, 'validateRequired');
            formValidator.validate(1);
          
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("Test validateRegex function",()=>{
        beforeAll(()=>{
            model = {
                jsPattern: "^[a-zA-Z ]*$",
            } as RegularExpressionValidatorModel;

            element = { 
                properties: {
                    validators: [{
                        type: ValidatorType.RegularExpressionValidator,
                        model
                    }]
                }
            } as ValidatableElementBase;

            formValidator = new FormValidator(element);
        });

        test("When value is not matched regex pattern, should return false",()=>{
            expect(formValidator.validateRegex("123", model)).toBeFalsy();
        });

        test("When value is matched regex pattern, should return true",()=>{
            expect(formValidator.validateRegex("abc", model)).toBeTruthy();
        });

        test("When value is null, should return true",()=>{
            expect(formValidator.validateRegex("", model)).toBeTruthy();
        });

        test("When regex pattern is null, should return true",()=>{
            expect(formValidator.validateRegex("abc", {} as RegularExpressionValidatorModel)).toBeTruthy();
        });

        describe("Test validateRegex called",()=>{
            const generateElement = (validatorType: string) => {
                return { 
                    properties: {
                        validators: [{
                            type: validatorType
                        }]
                    }
                } as ValidatableElementBase;
            }

            let arrayElements: ValidatableElementBase[] = [
                generateElement(ValidatorType.RegularExpressionValidator),
                generateElement(ValidatorType.DateDDMMYYYYValidator),
                generateElement(ValidatorType.DateMMDDYYYYValidator),
                generateElement(ValidatorType.DateYYYYMMDDValidator),
                generateElement(ValidatorType.UrlValidator),
                generateElement(ValidatorType.IntegerValidator),
                generateElement(ValidatorType.PositiveIntegerValidator),
                generateElement(ValidatorType.EmailValidator)
            ];
            
            test.each(arrayElements)("When validator is type of RegularExpressionValidator, validateRegex should be called",(e)=>{
                formValidator = new FormValidator(e);
                const spy = jest.spyOn(formValidator, 'validateRegex');
                formValidator.validate(1);
              
                expect(spy).toHaveBeenCalled();
            });
        });
    });

    describe("Test validateFileExtension function", ()=>{
        let filesValid = [{name:"test.jpg"}];
        let filesInvalid = [{name:"test.doc"}];
        let filesNoExt = [{name:"test"}];
        beforeAll(()=>{
            model = {
                accept: ".jpg,.pdf"
            } as AllowedExtensionsValidatorModel;

            element = { 
                properties: {
                    validators: [{
                        type: ValidatorType.AllowedExtensionsValidator,
                        model
                    }]
                }
            } as ValidatableElementBase;

            formValidator = new FormValidator(element);
        });

        test("When file has no extension, should return false", ()=>{
            expect(formValidator.validateFileExtension(filesNoExt, model)).toBeFalsy();
        });

        test("When file has extension and no acceptTypes, should return true", ()=>{
            expect(formValidator.validateFileExtension(filesInvalid, { accept: "" } as AllowedExtensionsValidatorModel)).toBeTruthy();
        });

        test("When file has extension that is not accepted, should return false", ()=>{
            expect(formValidator.validateFileExtension(filesInvalid, model)).toBeFalsy();
        });

        test("When file has extension that is accepted, should return true", ()=>{
            expect(formValidator.validateFileExtension(filesValid, model)).toBeTruthy();
        });

        test("When validator type is AllowedExtensionsValidator, validateFileExtension should be called",()=>{
            const spy = jest.spyOn(formValidator, 'validateFileExtension');
            formValidator.validate(filesValid);
          
            expect(spy).toHaveBeenCalled();
        });
        
    });

    describe("Test validateNumeric function", ()=>{
        beforeAll(()=>{
            element = { 
                properties: {
                    validators: [
                        {
                            type: ValidatorType.NumericValidator,
                        }
                    ]
                }
            } as ValidatableElementBase;
            formValidator = new FormValidator(element);
        });

        test("When value is not a number, should return false", ()=>{
            expect(formValidator.validateNumeric("a")).toBeFalsy();
        });

        test("When value is a number, should return true", ()=>{
            expect(formValidator.validateNumeric(1)).toBeTruthy();
        });

        test("When validator type is NumericValidator, validateNumeric should be called",()=>{
            const spy = jest.spyOn(formValidator, 'validateNumeric');
            formValidator.validate(1);
          
            expect(spy).toHaveBeenCalled();
        });
    });
});