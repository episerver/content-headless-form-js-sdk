/**
 * enum represent a dependent condition Operator (in the Rule to evaluate depend value).
 */
export enum ConditionFunctionType {
    MatchRegularExpression = "MatchRegularExpression",
    Contains = "Contains",
    NotContains = "NotContains",
    Equals = "Equals",
    NotEquals = "NotEquals",
}