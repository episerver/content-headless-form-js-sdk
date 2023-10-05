import { ValidatorsModel } from "../Validators"

/**
 *  Specialized form validator used to validate required field
 */
interface RequiredValidator extends ValidatorsModel {
    additionalAttributes: {
        required: string
        ariaRequired: boolean
    }
}

export default RequiredValidator