import React from "react";
import { FormContainer, StepBuilder, initFormState } from "@episerver/forms-sdk";
import { FormProvider } from "../context/FormProvider";
import { FormBody } from "./FormBody";

export interface FormContainerProps {
    form: FormContainer
}

export function FormContainerBlock(props: FormContainerProps){
    const stepBuilder = new StepBuilder(props.form);
    const form = stepBuilder.buildForm();
    const state = initFormState(form);

    {/* finally return the form */}
    return (
        <FormProvider initialState={state}>
            <FormBody />
        </FormProvider>
    )
}