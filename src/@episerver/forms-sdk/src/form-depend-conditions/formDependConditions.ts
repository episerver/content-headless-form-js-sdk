import { equals, isNull } from "../helpers";
import { ConditionCombinationType, ConditionProperties, FormElementBase, FormSubmission } from "../models";
import { ConditionFunctions } from "./ConditionFunctions";
/**
 * Class to check if a element conditions is met
 */
export class FormDependConditions {
    readonly _element: FormElementBase;
    constructor(element: FormElementBase) {
        this._element = element;
    }
    /**
     * Main function to check if a element conditions is met
     * @param formSubmissions 
     * @returns 
     */
    checkConditions = (formSubmissions: FormSubmission[]): boolean => {
        if (!isNull(formSubmissions)) {
            const conditionProps = (this._element.properties as unknown) as ConditionProperties;
            if (isNull(conditionProps?.conditions)) {
                // no condition to check, return true
                return true;
            }
            for (let i = 0; i < conditionProps.conditions.length; i++) {
                const condition = conditionProps.conditions[i]
                const fieldValue = formSubmissions.filter(s => equals(s.elementKey, condition.field))[0]?.value as string
                const conditionFunction = ConditionFunctions[condition.operator];
                if (!isNull(conditionFunction)){
                    let checkResult = conditionFunction(fieldValue, condition.fieldValue)
                    if (conditionProps.conditionCombination === ConditionCombinationType.Any && checkResult) {
                        return true
                    }
                    if (conditionProps.conditionCombination !== ConditionCombinationType.Any && !checkResult) {
                        return false
                    }
                }
            }
            // When reach here, there are two cases
            // 1 : All conditions are statisfied and ConditionCombination === ConditionCombinations.All
            // 2 : No condition is statisfied and ConditionCombination === ConditionCombinations.Any
            return !(conditionProps.conditionCombination === ConditionCombinationType.Any);
        }
        return false
    }
}