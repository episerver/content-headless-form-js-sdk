'use strict';

import { parseKeyToGuid } from "../helpers";
import { FormContainer } from "../models";
import { ApiClient } from "./apiClient";
import { ApiClientConfig, defaultConfig } from "./apiClientConfig";
import { ApiConstant } from "./apiConstant";

/**
 * Class for load Form
 */
export class FormLoader<T extends FormContainer> {
    readonly client: ApiClient<T>;

    /**
     *  Constructor an instance of FormLoader
     * 
     * @param config Optional config to use. This config will combined with the defaultConfig.
     */
    constructor(config?: Partial<ApiClientConfig>) {
        this.client = new ApiClient<T>({ ...defaultConfig, ...config});
    }

    /**
     * Get a form with a GUID
     * 
     * @param key GUID of form
     * @param language Localization for form
     * @returns A promise with a form 
     */
    getForm(key: string, language: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.client.get(`${ApiConstant.apiEndpoint}/${key}`, { language })
                .then((response: T) => {
                    resolve(response);
                })
                .catch((error: any) => {
                    reject(error);
                });
        })
    }

    /**
     * Query a form with a GUID
     * 
     * @param optiGraphUrl The endpoint url of Optimizely Graph
     * @param key GUID of form
     * @param language Localization for form
     * @returns A promise with a form 
     */
    queryForm(optiGraphUrl: string, key: string, language: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            let query: string = `
            query FormQuery($key: String, $language: String) {
                FormContainerBlock (
                    where: {
                        ContentLink: {
                            GuidValue:{eq: $key}
                        }
                        Language: {
                            Name: {eq: $language}
                        }
                    }
                ){
                    items {
                        FormRenderTemplate
                    }
                }
            }
            `;
            let variables: any = { key: parseKeyToGuid(key), language };
            fetch(optiGraphUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        query,
                        variables,
                    }),
                })
                .then(async (response: Response) => {
                    if(response.ok){
                        let json = await response.json();
                        let formStr = json.data.FormContainerBlock.items[0]?.FormRenderTemplate;
                        if(formStr){
                            resolve(JSON.parse(formStr) as T);
                        }
                        else {
                            reject(response);
                        }
                    }
                    else {
                        reject(response);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                });
        });
    }
}