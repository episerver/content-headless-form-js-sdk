import { FormElementBase } from "@episerver/forms-sdk";
import React from "react";
import { RenderElement } from "./RenderElement";

export interface RenderElementInStepProps {
    stepIndex: number,
    elements: FormElementBase[]
}

export function RenderElementInStep(props: RenderElementInStepProps){
    const {elements} = props;
    return (
        <>
            {elements.map(e => (
                <RenderElement element={e} key={e.key} />
            ))}
        </>
    );
}