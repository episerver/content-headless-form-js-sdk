'use strict';

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
}