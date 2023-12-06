import { ButtonBase, ButtonBaseProperties } from "./base/ButtonBase";
/**
 * Note that reset button must be in a "form tag" for being functional
 */
export interface ResetButton extends ButtonBase {
    properties:ResetButtonProperties
}

export interface ResetButtonProperties extends ButtonBaseProperties{

}