import { ConditionFunctions } from "../form-depend-conditions/ConditionFunctions";
import { FormStorage } from "../form-storage";
import { equals, isInArray, isNullOrEmpty } from "../helpers";
import { FormContainer, FormStep } from "../models";
import { StepHelper } from "../helpers/stepHelper";

/**
 * Class to help check step is satisfy depend condition
 */
export class StepDependCondition {
    readonly _form: FormContainer;
    readonly _formStorage: FormStorage;
    readonly _inactiveElements: string[];
    readonly _tempBaseUrl = "http://temp";
    readonly _stepHelper: StepHelper;
    /**
     * The constructor of class StepDependCondition
     * @param form Current form container
     * @param inactiveElements List of inactive elements. This param can passed from {@link FormState}.
     */
    constructor(form: FormContainer, inactiveElements: string[]){
        this._form = form;
        this._formStorage = new FormStorage(form);
        this._inactiveElements = inactiveElements;
        this._stepHelper = new StepHelper(form);
    }

    /**
     * Check if step is satisfy the depend condition
     * @param stepIndex 
     * @returns 
     */
    isSatisfied (stepIndex: number): boolean {
        let step = this._form.steps[stepIndex]?.formStep;

        if (!step) {
            return false;
        }

        let dependField = step.properties?.dependField,
            storedData = this._formStorage.loadFormDataFromStorage().find(fs => fs.elementKey === dependField?.key),
            funcOfDependCondition = ConditionFunctions[step.properties?.dependCondition]; 

        if (!dependField || !funcOfDependCondition || !storedData) { // no input to check, consider it's OK
            return true;
        }

        if(!dependField && isInArray(dependField, this._inactiveElements)){
            return funcOfDependCondition(null, step.properties.dependValue);
        }

        return funcOfDependCondition(storedData?.value, step.properties.dependValue);
    }

    /**
     * Rescusive finding next step to display in form.
     * @param currentStepIndex 
     * @returns 
     */
    findNextStep (currentStepIndex: number): number | undefined {
        let nextStepIndex = currentStepIndex + 1;
        let nextStep = this._form.steps[nextStepIndex];

        if(nextStep){
            return this.isSatisfied(nextStepIndex) 
                ? nextStepIndex 
                : this.findNextStep(nextStepIndex);
        }
        //go here in case: Form there are 2 steps, and last step depend on an element on step 1, but it's not satisfied. 
        //The next step will be never found, so we will return the last step.
        return this._form.steps.length - 1;
    }

    /**
     * Find previous step to display in form.
     * @param currentStepIndex 
     * @returns 
     */
    findPreviousStep (currentStepIndex: number): number | undefined {
        let prevStepIndex = currentStepIndex - 1;
        let prevStep = this._form.steps[prevStepIndex];

        if(prevStep){
            return this.isSatisfied(prevStepIndex) 
                ? prevStepIndex 
                : this.findPreviousStep(prevStepIndex);
        }
        return undefined;
    }

    

    /**
     * Whether step index is valid to display
     * @param stepIndex 
     * @param currentPageUrl 
     * @returns 
     */
    isStepValidToDisplay (stepIndex: number, currentPageUrl: string): boolean {
        let totalStep = this._form.steps.length;
        if(stepIndex < 0 || stepIndex >= totalStep){
            return false;
        }
        let step = this._form.steps[stepIndex].formStep;
        let attachedContent = step.properties?.attachedContentLink;
        let attachedContentUrl = new URL(attachedContent, this._tempBaseUrl);
        let pageUrl = new URL(currentPageUrl, this._tempBaseUrl)
        // if the step is not configured for display in current page, return false
        if(!isNullOrEmpty(attachedContent) && !equals(attachedContentUrl.pathname, pageUrl.pathname)){
            return false;
        }
        // always display the last step
        if (stepIndex == totalStep - 1)
        {
             return true;
        }
        if(!this._stepHelper.isNeedCheckDependCondition(stepIndex)){
            // the step has no depend condition always display
            return true;
        }
        //the step has depend condition
        let submissionData = this._formStorage.loadFormDataFromStorage();
        if(submissionData.length === 0){
            return false
        }
        let inactiveStepsIndex = this.getInactiveStepsIndex();
        return !inactiveStepsIndex.some(i => i === stepIndex);
    }

    /**
     * Get an array of step index that are inactive by depend conditions
     * @returns 
     */
    getInactiveStepsIndex(): number[] {
        let totalStep = this._form.steps.length;
        if(totalStep === 1){
            return [];
        }
        let inactiveSteps: number[] = [];

        this._form.steps.forEach((s, i) => {
            if(this._stepHelper.isNeedCheckDependCondition(i) && !this.isSatisfied(i)){
                inactiveSteps = inactiveSteps.concat(i);
            }
        });

        return inactiveSteps;
    }

    
}