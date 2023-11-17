import React from "react";
import { FormContainer, StepBuilder } from "@optimizely/forms-sdk";
import { FormProvider } from "../context/FormProvider";
import { initState } from "../context/initState";
import { FormBody } from "./FormBody";

export interface FormContainerProps {
    form: FormContainer
}

export function FormContainerBlock(props: FormContainerProps){
    const stepBuilder = new StepBuilder(props.form);
    const form = stepBuilder.buildForm();
    const state = initState({formContainer: form});

    {/* finally return the form */}
    return (
        <FormProvider initialState={state}>
            <FormBody />
        </FormProvider>
    )
}