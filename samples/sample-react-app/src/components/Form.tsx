import { FormContainer, FormLoader } from "@optimizely/forms-sdk";
import React, { useEffect, useState } from "react";

interface FormProps {
    formKey: string,
    language: string | undefined
}

export default function Form ({formKey, language}: FormProps) {

  const formLoader = new FormLoader({
    baseURL: process.env.REACT_APP_HEADLESS_FORM_BASE_URL
  });

  const [form, setForm] = useState<FormContainer | null>(null);

  useEffect(()=>{
    if(!form){
      formLoader.getForm(formKey, language ?? "en")
        .then((res)=>setForm(res));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[formKey]);

  return (
    <>
      {form && (
          <>
              <h2>{form.properties.title}</h2>
              <h3>Elements</h3>
              {form.formElements.map(e => (
                  <ul>
                      <li key={e.key}>{`${e.contentType}: ${e.displayName}`}</li>
                  </ul>
              ))}
          </>
      )}
    </>
  );
}