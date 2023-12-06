/**
 * Determines whether the element should be displayed or hidden based on a given condition
 */
export interface Condition {
    field: string
    operator: string
    fieldValue: string
}