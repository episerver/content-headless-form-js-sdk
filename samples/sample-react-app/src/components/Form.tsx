import { FormContainerBlock } from "@optimizely/forms-react"
import { UseFormLoaderProps, useFormLoader } from "../hooks/useFormLoader";

interface FormProps {
    formKey: string,
    language: string | undefined
}

export default function Form ({formKey, language}: FormProps) {
  const {data: formData } = useFormLoader({ formKey, language, baseUrl: process.env.REACT_APP_HEADLESS_FORM_BASE_URL } as UseFormLoaderProps)

  return (
    <>
        {formData && <FormContainerBlock form={formData} key={formData.key} />}
    </>
  );
}