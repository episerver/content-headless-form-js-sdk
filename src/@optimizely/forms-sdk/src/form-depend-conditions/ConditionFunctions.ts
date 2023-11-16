import { isNull, isNullOrEmpty } from "../helpers";
import { getConcatString } from "../helpers/dependencyHelper";
import { ConditionFunctionType } from "../models";

export type ConditionFunctionRecord = Record<string, (actualValue: Object, patternOfExpected: string) => boolean>;

export const ConditionFunctions: ConditionFunctionRecord = {
    [ConditionFunctionType.Contains]: Contains,
    [ConditionFunctionType.NotContains]: NotContains,
    [ConditionFunctionType.Equals]: Equals,
    [ConditionFunctionType.NotEquals]: NotEquals,
    [ConditionFunctionType.MatchRegularExpression]: MatchRegularExpression,
};
/**
 * Compare whether user input data equals depend value or not.
 * @param actualValue 
 * @param dependencyFieldValue 
 * @returns 
 */
function Equals(actualValue: Object, dependencyFieldValue: string): boolean {
    const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
    dependencyFieldValue = !dependencyFieldValue ? "" : dependencyFieldValue.toUpperCase();
    return _actualValue === dependencyFieldValue;
}
/**
 * Compare whether user input data does NOT equal depend value or not.
 * @param actualValue 
 * @param dependencyFieldValue 
 * @returns 
*/
function NotEquals(actualValue: Object, dependencyFieldValue: string): boolean {
    const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
    dependencyFieldValue = !dependencyFieldValue ? "" : dependencyFieldValue.toUpperCase();
    return _actualValue !== dependencyFieldValue;
}
/**
 * Compare whether user input data contains depend value or not.
 * @param actualValue 
 * @param dependencyFieldValue 
 * @returns 
 */
function Contains(actualValue: Object, dependencyFieldValue: string): boolean {
    const _actualValue = isNull(actualValue) ? "" : getConcatString(actualValue, ",").toUpperCase();
    dependencyFieldValue = !dependencyFieldValue ? "" : dependencyFieldValue.toUpperCase();
    return _actualValue.indexOf(dependencyFieldValue) >= 0;
}
/**
 * Compare whether user input data does NOT contain depend value or not.
 * @param actualValue 
 * @param dependencyFieldValue 
 * @returns 
 */
function NotContains(actualValue: Object, dependencyFieldValue: string): boolean {
    const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
    const actualValueNull = isNullOrEmpty(_actualValue)
    const dependencyFieldValueNull = isNullOrEmpty(dependencyFieldValue)
    return (!actualValueNull && dependencyFieldValueNull) ||
        (actualValueNull && !dependencyFieldValueNull) ||
        (!actualValueNull && !dependencyFieldValueNull && _actualValue.toUpperCase().indexOf(dependencyFieldValue.toUpperCase()) < 0);
}
/**
 * Compare user input with a pattern. Return true if actualValue matchs patternOfExpected
 * @param actualValue 
 * @param patternOfExpected 
 * @returns 
 */
function MatchRegularExpression(actualValue: Object, patternOfExpected: string): boolean {
    var regex = new RegExp(patternOfExpected, "igm");
    const _actualValue = !actualValue ? "" : getConcatString(actualValue, ",");
    return isNullOrEmpty(patternOfExpected) || (!isNullOrEmpty(patternOfExpected) && regex.test(_actualValue));
}

