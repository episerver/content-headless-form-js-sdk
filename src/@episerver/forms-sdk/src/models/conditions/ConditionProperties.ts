import { Condition } from "./Conditions";
/**
 * Block that will be displayed or hidden based on a given condition
 */
export interface ConditionProperties {
    satisfiedAction: string
    conditionCombination: string
    conditions: Condition[]
}