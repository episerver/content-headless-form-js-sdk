import React from "react";
import { FormContainerBlock } from "./components/FormContainerBlock";
import { UseFormLoaderProps, useFormLoader } from "./hooks/useFormLoader";
import "./Form.scss"
import { IdentityInfo } from "@episerver/forms-sdk";

interface FormProps {
    /**
     * The form key that identifies the form
     */
    formKey: string;
    /**
     * The code of the form language
     */
    language?: string;
    /**
     * The base url of Headless Form API
     */
    baseUrl: string;
    /**
     * Access token for form submit
     */
    identityInfo?: IdentityInfo;
    /**
     * The instance of useHistory() received from react-router-dom
     */
    history?: any;
    /**
     * The public url of current page
     */
    currentPageUrl?: string;
}

export const Form = ({formKey, language, baseUrl, identityInfo, history, currentPageUrl}: FormProps) => {
  const {data: formData } = useFormLoader({ formKey, language, baseUrl } as UseFormLoaderProps)

  return (
    <>
        {formData && <FormContainerBlock form={formData} key={formData.key} identityInfo={identityInfo} baseUrl={baseUrl} history={history} currentPageUrl={currentPageUrl}/>}
    </>
  );
}