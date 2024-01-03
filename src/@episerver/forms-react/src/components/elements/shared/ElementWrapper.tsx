import { FormValidationResult } from "@episerver/forms-sdk";
import React, { ReactNode } from "react";

export interface ElementWrapperProps{
    className?: string;
    isVisible: boolean;
    children: ReactNode;
    validationResults?: FormValidationResult;
    extraAttr?: any
}

export default function ElementWrapper(props: ElementWrapperProps){
    const isFail = !props.validationResults?.result?.valid;

    return (
        <>
            {props.isVisible && (
                <div className={`Form__Element ${props.className} ${isFail ? "ValidationFail" : "ValidationSuccess"}`} {...props.extraAttr}>
                    {props.children}
                </div>
            )}
        </>
    );
}