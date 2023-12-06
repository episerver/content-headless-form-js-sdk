import { FormStep } from "@episerver/forms-sdk";
import React from "react";

export interface FormStepBlockProps{
    element: FormStep
}

export const FormStepBlock = (props: FormStepBlockProps) => {
    const { element } = props;

    return (
        <>
            <h3 className="FormStep__Title">{element.properties.label}</h3>
            <aside className="FormStep__Description">{element.properties.description}</aside>
        </>
    )
}