import { equals, isNull, isNullOrEmpty } from "../helpers";
import { FormContainer, FormValidationResult } from "../models";

/**
 * Class for step function helpers
 */
export class StepHelper {
    readonly _form: FormContainer;
    readonly _tempBaseUrl = "http://temp";

    constructor(form: FormContainer){
        this._form = form;
    }

    /**
     * Verify this Form has all steps not attached to any page.
     * @returns true if no steps attached to any page.
     */
    isAllStepsAreNotLinked(): boolean {
        return !this._form.steps.some(s => !isNullOrEmpty(s.formStep.properties?.attachedContentLink));
    } 

    /**
     * Check whether a Form has steps each attached to a page.
     * @returns true if there is a step does not attach to any page but others do.
     */
    isMalFormSteps(): boolean {
        let isMalform = false;
        let totalStep = this._form.steps.length;
        
        if(totalStep >= 2 && !this.isAllStepsAreNotLinked()){
            isMalform = this._form.steps.some(s => isNullOrEmpty(s.formStep.properties?.attachedContentLink))            
        }
        return isMalform;
    }

    /**
     * Get current step index depend on current page url
     * @param currentPageUrl 
     * @returns 
     */
    getCurrentStepIndex (currentPageUrl?: string): number {
        let currentStepIndex = 0;
        
        if(this.isAllStepsAreNotLinked()){
            currentStepIndex = 0;
        }
        else {
            this._form.steps.every((s, i)=>{
                let url = new URL(s.formStep.properties?.attachedContentLink, this._tempBaseUrl);
                let pageUrl = new URL(currentPageUrl ?? "/", this._tempBaseUrl)
                if(equals(pageUrl.pathname, url.pathname)){
                    currentStepIndex = i;
                    return false;
                }
                return true;
            });
        }
        return currentStepIndex;
    }

    /**
     * Check whether element is in step
     * @param elementKey 
     * @param stepIndex 
     * @returns true if element is in step, otherwise false
     */
    isInCurrentStep (elementKey: string, stepIndex: number): boolean {
        let currentStep = this._form.steps[stepIndex];
        if(currentStep){
            return currentStep.elements.some(e => equals(e.key, elementKey));
        }
        return true;
    }

    /**
     * Get the first elementKey in the list element that are invalid value
     * @param formValidationResults 
     * @param stepIndex 
     * @returns 
     */
    getFirstInvalidElement (formValidationResults: FormValidationResult[], stepIndex: number): string {
        return formValidationResults.filter(fv => 
            !fv.result.valid &&    
            this.isInCurrentStep(fv.elementKey, stepIndex)
        )[0]?.elementKey;
    }

    /**
     * Check whether a step is needed to check depend condition
     * @param stepIndex 
     * @returns true if dependField property not null
     */
    isNeedCheckDependCondition(stepIndex: number): boolean {
        let step = this._form.steps[stepIndex]?.formStep;
        if(isNull(step)) {
            return false;
        }
        return !isNullOrEmpty(step.properties?.dependField?.key)
    }
}