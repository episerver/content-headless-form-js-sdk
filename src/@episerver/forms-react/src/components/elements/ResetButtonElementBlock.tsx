import React, { useMemo } from "react";
import { ResetButton } from "@episerver/forms-sdk";
import { useElement } from "../../hooks/useElement";

interface ResetButtonElementBlockProps {
    element: ResetButton
}

export const ResetButtonElementBlock = (props: ResetButtonElementBlockProps) => {
    const { element } = props;
    const { elementContext, handleReset } = useElement(element);
    const { extraAttr } = elementContext;

    return useMemo(() => (
        <>
            <input
                type="reset"
                className="Form__Element FormResetButton Form__Element--NonData"
                {...extraAttr}
                value={element.properties.label}
                onClick={handleReset}
            />
        </>
    ), []);
}