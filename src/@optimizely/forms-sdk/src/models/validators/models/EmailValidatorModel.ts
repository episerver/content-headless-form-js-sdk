import { ValidatorsModel } from "../Validators"

/**
 *  Specialized form validator used to validate email addresses entered by user
 */
interface EmailValidator extends ValidatorsModel {
    jsPattern: string
    dotnetPattern: string
}

export default EmailValidator