import { DataElementBlockBase } from "@episerver/forms-sdk";
import React from "react";

interface DataListProps {
    element: DataElementBlockBase
}

export const DataList = (props: DataListProps) => {
    const { element } = props;

    return (
        <>
            {element.properties.forms_ExternalSystemsFieldMappings?.length > 0 && 
                <datalist id={`${element.key}_datalist`}>
                    {element.properties.forms_ExternalSystemsFieldMappings?.map(i => 
                        <option value={i} key={i}></option>
                    )}
                </datalist>
            }
        </>
    )
}