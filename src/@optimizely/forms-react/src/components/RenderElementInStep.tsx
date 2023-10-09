import { FormElementBase } from "@optimizely/forms-sdk";
import React from "react";
import { RenderElement } from "./RenderElement";

export interface RenderElementInStepProps {
    stepIndex: number,
    elements: FormElementBase[]
}

export function RenderElementInStep(props: RenderElementInStepProps){
    const {elements} = props;
    return (<>
        {elements.map(e => (
            <RenderElement name={e.contentType} element={e} key={e.key} />
        ))}
    </>);
}