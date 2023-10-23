import { StepBuilder } from "../../src/form-step";
import { FormContainer, FormElementBase } from "../../src/models";

describe("Test class StepBuilder", ()=>{
    test("If form container hasn't any form step, then length of step array should be one", ()=>{
        let formContainer = {
            key: "ef81d05661954c5aa76974d87ef58c99",
            formElements: [
                {
                    key: "4baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextboxElementBlock"
                },
                {
                    key: "5baf6558977443d99ce6a7bdce887d2b",
                    contentType: "SubmitElementBlock"
                }
            ]
        } as FormContainer;
        let stepBuilder = new StepBuilder(formContainer);
        expect(stepBuilder.buildForm().steps.length).toBe(1);
    })

    test("If form container has only a form step at first, then length of step array should be one", ()=>{
        let formContainer = {
            key: "ef81d05661954c5aa76974d87ef58c99",
            formElements: [
                {
                    key: "3baf6558977443d99ce6a7bdce887d2b",
                    contentType: "FormStepBlock"
                },
                {
                    key: "4baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextboxElementBlock"
                },
                {
                    key: "5baf6558977443d99ce6a7bdce887d2b",
                    contentType: "SubmitElementBlock"
                }
            ]
        } as FormContainer;
        let stepBuilder = new StepBuilder(formContainer);
        expect(stepBuilder.buildForm().steps.length).toBe(1);
    })

    test("If form container has only a form step (not at first), then length of step array should be two", ()=>{
        let formContainer = {
            key: "ef81d05661954c5aa76974d87ef58c99",
            formElements: [
                {
                    key: "4baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextboxElementBlock"
                },
                {
                    key: "3baf6558977443d99ce6a7bdce887d2b",
                    contentType: "FormStepBlock"
                },
                {
                    key: "5baf6558977443d99ce6a7bdce887d2b",
                    contentType: "SubmitElementBlock"
                }
            ]
        } as FormContainer;
        let stepBuilder = new StepBuilder(formContainer);
        expect(stepBuilder.buildForm().steps.length).toBe(2);
    })

    test("If form container has three form step as normally, then length of step array should be three", ()=>{
        let formContainer = {
            key: "ef81d05661954c5aa76974d87ef58c99",
            formElements: [
                //first step
                {
                    key: "2baf6558977443d99ce6a7bdce887d2b",
                    contentType: "FormStepBlock"
                },
                {
                    key: "4baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextboxElementBlock"
                },
                {
                    key: "1baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextboxElementBlock"
                },
                //second step
                {
                    key: "3baf6558977443d99ce6a7bdce887d2b",
                    contentType: "FormStepBlock"
                },
                {
                    key: "6baf6558977443d99ce6a7bdce887d2b",
                    contentType: "TextareaElementBlock"
                },
                //last step
                {
                    key: "7baf6558977443d99ce6a7bdce887d2b",
                    contentType: "FormStepBlock"
                },
                {
                    key: "5baf6558977443d99ce6a7bdce887d2b",
                    contentType: "SubmitElementBlock"
                }
            ]
        } as FormContainer;
        let stepBuilder = new StepBuilder(formContainer);
        expect(stepBuilder.buildForm().steps.length).toBe(3);
    })
})