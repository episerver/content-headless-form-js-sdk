import { newUniqueID } from "../helpers/generateId";
import { FormContainer, FormElementBase, Step, FormStep } from "../models";

export class StepBuilder {
    _form: FormContainer;

    constructor(form: FormContainer) {
        this._form = form;
    }

    buildForm(): FormContainer{
        let steps: Step[] = [];
        let elements: FormElementBase[] = [];
    
        let currentStep = { key: newUniqueID() } as FormElementBase;
    
        this._form.formElements.forEach((e,i) => {
            if (this.isFormStep(e)) {
                if (i !== 0)
                {
                    //if element is form step, then save list element to current step
                    steps.push({ formStep: {...currentStep}, elements: [...elements] });
                }
                
                //reset vars
                elements = [];
                currentStep = {...e};
            }
            else {
                //add element to list of element of current step
                elements.push(e);
            }
            
        });
    
        //if there is only one step, save list element to step
        steps.push({ formStep: {...currentStep}, elements: [...elements] });
    
        return {
            ...this._form, 
            steps
        };
    }

    isFormStep(object: any): object is FormStep {
        return 'attachedContentLink' in object;
    }
}