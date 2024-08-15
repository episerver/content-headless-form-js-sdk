import { ResetButton } from "@episerver/forms-sdk";

interface ResetButtonElementBlockProps {
    resetButton: ResetButton;
    handleReset: (e: any) => void;
}

const ResetButtonElementBlock: React.FC<ResetButtonElementBlockProps> = ({ resetButton, handleReset }) => {
    return (
        <>
            <input id={resetButton.key}
                name="reset"
                type="reset"
                key={resetButton.key}
                onClick={(e) => handleReset(e)}
                className='form_submit_btn'
                value={resetButton.properties.label}
            />
        </>
    )
}

export default ResetButtonElementBlock;