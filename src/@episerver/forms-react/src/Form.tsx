import React from "react";
import { FormContainerBlock } from "./components/FormContainerBlock";
import { UseFormLoaderProps, useFormLoader } from "./hooks/useFormLoader";
import "./Form.scss"

interface FormProps {
    /**
     * The form key that identifies the form
     */
    formKey: string,
    /**
     * The code of the form language
     */
    language?: string,
    /**
     * The base url of Headless Form API
     */
    baseUrl?: string
}

export const Form = ({formKey, language, baseUrl}: FormProps) => {
  const {data: formData } = useFormLoader({ formKey, language, baseUrl } as UseFormLoaderProps)

  return (
    <>
        {formData && <FormContainerBlock form={formData} key={formData.key} />}
    </>
  );
}