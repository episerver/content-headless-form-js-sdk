import React, { useEffect, useState } from 'react';
import './App.css';
import FormComponent from './Forms';
import { FormContainer, FormLoader } from '@episerver/forms-sdk';

function App() {

    const [formData, setformData] = useState<FormContainer>();

    useEffect(() => {
        const formLoader = new FormLoader({
            baseURL: "a"
        });

        let promise: Promise<FormContainer>;

        promise = formLoader.queryForm("https://staging.cg.optimizely.com/content/v2?auth=RG10AaLFjseEB2c1m5oYikJcDsDFhjfItugS44eBBZievhPK", "93fc0ddc-1491-47f6-aeec-0026fcb081a4", "en");

        if (promise) {
            promise.then((result) => {
                setformData(result)
                console.log(result)
            }).catch(error => {
                console.error('Error loading form:', error);
            });
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                {
                    formData ?
                        (
                            <FormComponent formData={formData} />
                        )
                        :
                        (
                            <div>Loading form...</div>
                        )
                }
            </header>
        </div>
    );
}

export default App;
