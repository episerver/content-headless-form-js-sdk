import { ElementValidationResult } from "@episerver/forms-sdk";
import React, { ReactNode } from "react";

export interface ElementWrapperProps{
    className?: string
    isVisible: boolean,
    children: ReactNode,
    validationResults?: ElementValidationResult[]
}

export default function ElementWrapper(props: ElementWrapperProps){
    const isFail = props.validationResults?.some(r => !r.valid);

    return (
        <>
            {props.isVisible && (
                <div className={`Form__Element ${props.className} ${isFail ? "ValidationFail" : "ValidationSuccess"}`}>
                    {props.children}
                </div>
            )}
        </>
    );
}