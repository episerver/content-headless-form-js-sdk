import React, { ReactNode } from "react";

export interface ElementWrapperProps{
    className: string
    isVisible: boolean,
    children: ReactNode
}

export default function ElementWrapper(props: ElementWrapperProps){
    return (
        <>
            {props.isVisible && (
                <div className={`Form__Element ${props.className}`}>
                    {props.children}
                </div>
            )}
        </>
    );
}