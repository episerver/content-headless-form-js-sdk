import { SubmitButton } from "@episerver/forms-sdk";

interface SubmitButtonElementBlockProps {
    submitButton: SubmitButton;
    handleSubmit: (e: any) => void;
}

const SubmitButtonElementBlock: React.FC<SubmitButtonElementBlockProps> = ({ submitButton, handleSubmit }) => {
    return (
        <>
            <button id={submitButton.key}
                name="submit"
                type="submit"
                key={submitButton.key}
                onClick={(e) => handleSubmit(e)}
                className='form_submit_btn'
            >
                {submitButton.properties.label}
            </button>
        </>
    )
}

export default SubmitButtonElementBlock;