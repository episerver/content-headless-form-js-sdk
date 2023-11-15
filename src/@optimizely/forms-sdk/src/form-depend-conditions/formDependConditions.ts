import { equals, isNull, isNullOrEmpty } from "../helpers";
import { getConcatString } from "../helpers/dependencyHelper";
import { ConditionCombinationType, ConditionFunctionType, ConditionProperties, FormElementBase, FormSubmission } from "../models";

export class FormDependConditions {
    readonly _element: FormElementBase;
    constructor(element: FormElementBase) {
        this._element = element;
    }
    checkConditions = (formSubmissions: FormSubmission[]): boolean => {
        if (!isNull(formSubmissions)) {
            const conditionProps = (this._element.properties as unknown) as ConditionProperties;
            if (isNull(conditionProps?.conditions)) {
                return false;
            }
            let conditionArr = conditionProps.conditions.map(condition => {
                const fieldValue = formSubmissions.filter(s => equals(s.elementKey, condition.field))[0]?.value as string
                if (!isNull(fieldValue)) {
                    switch (condition.operator) {
                        case ConditionFunctionType.Contains:
                            return this.Contains(fieldValue, condition.fieldValue)
                        case ConditionFunctionType.NotContains:
                            return this.NotContains(fieldValue, condition.fieldValue)
                        case ConditionFunctionType.Equals:
                            return this.Equals(fieldValue, condition.fieldValue)
                        case ConditionFunctionType.NotEquals:
                            return this.NotEquals(fieldValue, condition.fieldValue)
                        case ConditionFunctionType.MatchRegularExpression:
                            return this.MatchRegularExpression(fieldValue, condition.fieldValue)
                    }
                }
                return false
            });
            for (let i = 0; i < conditionArr.length; i++) {
                const result = conditionArr[i]
                if (conditionProps.conditionCombination === ConditionCombinationType.Any && result) {
                    return true
                }
                if (conditionProps.conditionCombination === ConditionCombinationType.All && !result) {
                    return false
                }
            }
            // When reach here, there are two cases
            // 1 : All conditions are statisfied and ConditionCombination === ConditionCombinations.All
            // 2 : No condition is statisfied and ConditionCombination === ConditionCombinations.Any
            return conditionProps.conditionCombination === ConditionCombinationType.All;
        }
        return false
    }
    Equals(actualValue: Object, expectedValue: string): boolean {
        /** 
        *   Summary:
        *       Compare whether user input data equals depend value or not.
        *   actualValue: [Object]
        *       Value that user has input
        *   expectedValue: string
        *       The depend value need to be verified.
        *   returns: [Boolean] 
        */
        const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
        expectedValue = !expectedValue ? "" : expectedValue.toUpperCase();
        return _actualValue === expectedValue;
    }
    NotEquals(actualValue: Object, expectedValue: string): boolean {
        /**
        *   Summary:
        *      Compare whether user input data does NOT equal depend value or not.
        *   actualValue: [Object]
        *       Value that user has input
        *   expectedValue: string
        *       The depend value need to be verified.
        *   returns: [Boolean] 
        */
        const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
        expectedValue = !expectedValue ? "" : expectedValue.toUpperCase();
        return _actualValue !== expectedValue;
    }
    Contains(actualValue: Object, expectedValue: string): boolean {
        /**
        *   Summary:
        *       Compare whether user input data contains depend value or not.
        *   actualValue: [Object]
        *       Value that user has input
        *   expectedValue: string
        *       The depend value need to be verified.
        *   returns: [Boolean]
        */
        const _actualValue = isNull(actualValue) ? "" : getConcatString(actualValue, ",").toUpperCase();
        expectedValue = !expectedValue ? "" : expectedValue.toUpperCase();
        return _actualValue.indexOf(expectedValue) >= 0;
    }
    NotContains(actualValue: Object, expectedValue: string): boolean {
        /**
        *   Summary:
        *      Compare whether user input data does NOT contain depend value or not.
        *   actualValue: [Object]
        *       Value that user has input
        *   expectedValue: string
        *       The depend value need to be verified.
        *   returns: [Boolean]
        */
        const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
        const actualValueNull = isNullOrEmpty(_actualValue)
        const expectedValueNull = isNullOrEmpty(expectedValue)
        return (!actualValueNull && expectedValueNull) ||
            (actualValueNull && !expectedValueNull) ||
            (!actualValueNull && !expectedValueNull && _actualValue.toUpperCase().indexOf(expectedValue.toUpperCase()) < 0);
    }
    MatchRegularExpression(actualValue: Object, patternOfExpected: string): boolean {
        /**
        *   Summary:
        *       Compare user input with a pattern. Return true if actualValue matchs patternOfExpected
        *   actualValue: [Object]
        *       Value that user has input
        *   patternOfExpected: [Object]
        *       The depend value need to be verified.
        *   returns: [Boolean]
        */
        var regex = new RegExp(patternOfExpected, "igm");
        const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
        return isNullOrEmpty(patternOfExpected) || (!isNullOrEmpty(patternOfExpected) && regex.test(_actualValue));
    }
}