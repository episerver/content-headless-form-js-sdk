import { FormContainer, FormLoader } from "@episerver/forms-sdk";
import { useEffect, useState } from "react";

export interface UseFormLoaderProps {
    formKey: string
    language: string
    baseUrl: string
    optiGraphUrl: string
}

export const useFormLoader = (props: UseFormLoaderProps) => {
    const [data, setData] = useState<FormContainer | null>(null);
    const [error, setError] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const loadForm = () => {
            setLoading(true);
            const formLoader = new FormLoader({
                baseURL: props.baseUrl
            });

            let promise: Promise<FormContainer>;

            if(props.optiGraphUrl){
                promise = formLoader.queryForm(props.optiGraphUrl, props.formKey, props.language);
            }
            else {
                promise = formLoader.getForm(props.formKey, props.language);
            }

            if(promise){
                promise.then((result) => setData(result))
                    .catch((error) => setError(error))
                    .finally(() => setLoading(false));
            }
        }
        
        !loading && loadForm();
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.formKey, props.language]);

    return {data, error, loading};
}