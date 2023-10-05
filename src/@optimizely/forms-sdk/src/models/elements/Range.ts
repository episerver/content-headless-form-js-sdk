import { InputElementBase, InputElementBaseProperties } from "./base/InputElementBase";
/**
 * Allows users to select an integer value within a specified range
 */
export interface Range extends InputElementBase {
    properties: RangeProperties
}

export interface RangeProperties extends InputElementBaseProperties {

}