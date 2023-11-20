import { FormValidationResult, isInArray, isNull } from "@optimizely/forms-sdk";
import React, { ReactNode } from "react";

export interface ElementWrapperProps{
    className?: string
    isVisible: boolean,
    children: ReactNode,
    validationResults?: FormValidationResult[]
}

export default function ElementWrapper(props: ElementWrapperProps){
    const failClass = props.validationResults?.some(r => !r.valid) ? "ValidationFail" : "";

    return (
        <>
            {props.isVisible && (
                <div className={`Form__Element ${props.className} ${failClass}`}>
                    {props.children}
                </div>
            )}
        </>
    );
}