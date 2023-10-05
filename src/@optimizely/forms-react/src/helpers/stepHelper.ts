import { FormContainer, FormElementBase, Step, FormStep } from "@optimizely/forms-sdk";

export function buildFormStep(form: FormContainer): FormContainer{
    let steps: Step[] = [];
    let elements: FormElementBase[] = [];
    form.formElements.forEach(e => {
        if(!isFormStep(e)){
            elements.push(e);
        }
        else{
            //if element is form step, then save list element to current step
            steps.push({ formStep: e, elements: [...elements] });
            //reset list element
            elements = [];
        }
    });

    //save list element to step
    steps.push({ formStep: {} as FormElementBase, elements: [...elements] });

    return {...form, steps};
}

function isFormStep(object: any): object is FormStep {
    return 'attachedContentLink' in object;
}