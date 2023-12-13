import { ConditionFunctions } from "../form-depend-conditions/ConditionFunctions";
import { FormStorage } from "../form-storage";
import { isInArray } from "../helpers";
import { FormContainer, FormStep } from "../models";

/**
 * Class to help check step is satisfy depend condition
 */
export class StepDependCondition {
    readonly _form: FormContainer
    readonly _formStorage: FormStorage
    readonly _inactiveElements: string[]
    /**
     * The constructor of class StepDependCondition
     * @param form Current form container
     * @param inactiveElements List of inactive elements. This param can passed from {@link FormState}.
     */
    constructor(form: FormContainer, inactiveElements: string[]){
        this._form = form;
        this._formStorage = new FormStorage(form);
        this._inactiveElements = inactiveElements;
    }

    /**
     * Check if step is satisfy the depend condition
     * @param stepIndex 
     * @returns 
     */
    isSatisfied (stepIndex: number): boolean {
        let step = this._form.steps[stepIndex]?.formStep as FormStep;

        if (!step) {
            return false;
        }

        let dependField = step?.properties?.dependField,
            storedData = this._formStorage.loadFormDataFromStorage().filter(fs => fs.elementKey === dependField?.key)[0],
            funcOfDependCondition = ConditionFunctions[step?.properties?.dependCondition]; 

        if (!dependField || !funcOfDependCondition || !storedData) { // no input to check, consider it's OK
            return true;
        }

        if(!dependField && isInArray(dependField, this._inactiveElements)){
            return funcOfDependCondition(null, step?.properties?.dependValue);
        }

        return funcOfDependCondition(storedData?.value, step?.properties?.dependValue);
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
        return undefined;
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
}