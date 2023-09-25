import { Condition } from "../conditions/Conditions"
import { ButtonBase, ButtonBaseProperties } from "./Base/ButtonBase"

export interface SubmitButton extends ButtonBase {
    properties: SubmitButtonProperties
}

export interface SubmitButtonProperties extends ButtonBaseProperties {
    satisfiedAction: string
    conditionCombination: string
    conditions: Condition[]
}