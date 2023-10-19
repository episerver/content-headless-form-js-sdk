import { FormElementBase } from "@optimizely/forms-sdk";
import React from "react";

interface ElementCaptionProps{
    element: FormElementBase
}

export const ElementCaption = (props: ElementCaptionProps) => {
    const { element }=props;
    return (
        <label htmlFor={element.key} className="Form__Element__Caption">
            {element.properties.label}
        </label>
    );
}