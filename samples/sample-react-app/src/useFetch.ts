import { useEffect, useState } from "react";

export const useFetch = (url: string) => {
    const [data, setData]= useState<any>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);

    useEffect(()=>{
        const fetchData = async () => {
            setLoading(true);
            fetch(url)
                .then(async (response: Response)=>{
                    if(response.ok){
                        setData(await response.json());
                    }
                })
                .catch((err: any)=>{
                    setError(err);
                })
                .finally(()=>{
                    setLoading(false);
                });
        };
        
        if(!loading){
            fetchData();
        }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[url]);

    return {data, loading, error};
}