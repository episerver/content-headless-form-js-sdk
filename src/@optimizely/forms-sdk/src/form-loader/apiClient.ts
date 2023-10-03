'use strict';

import { ApiClientConfig } from "./apiClientConfig";

/**
 * Class for making API calls to the Optimizely Headless Form.
 */
export class ApiClient<T> {
    readonly config: ApiClientConfig;

    /**
    * Constructs an instance of ApiClient.
    *
    * @param initConfig Configuration to use.
    */
    constructor(initConfig: ApiClientConfig){
        this.config = initConfig;
    }

    /**
     * Make a request
     * 
     * @param path API endpoint url
     * @param method Method type of request, e.g. GET/POST 
     * @param params Collection of Query string, e.g. language=en
     * @param headers Collection of Header
     * @param data Payload data to post
     */
    async send(path: string, method: string, params?: Record<string,string>, headers?: Record<string, string>, data?: any): Promise<T> {
        let tempBase = "http://temp";
        //tempBase will not use if the url is absolute
        let url = new URL(`${this.config.baseURL}${path}`, tempBase);

        if(params){
            for(var key in params){
                url.searchParams.set(key, params[key]);
            }
        }

        const requestInit: RequestInit = {
            method,
            credentials: 'include',
            headers: headers ?? this.config.headers,
            body: data ? JSON.stringify(data) : undefined
        };

        return new Promise<T>((resolve, reject) => {
            fetch(url.href, requestInit)
                .then(async (response: Response) => {
                    if(response.ok){
                        let json = await response.json();
                        resolve(json as T);
                    }
                    else {
                        reject(response);
                    }
                })
                .catch((error: any) => {
                    reject(error);
                })
        })
    }

    /**
     * Make a GET request
     * 
     * @param path Api endpoint url to get
     * @param params Collection of Query string, e.g. language=en
     * @returns A promise with a T
     */
    async get(path: string, params?: Record<string, string>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.send(path, "GET", params).then((response: T) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }

    /**
     * Make a POST request
     * 
     * @param path Api endpoint url to post
     * @param data Payload data to post
     * @param params Collection of Query string, e.g. language=en
     * @returns A promise with a T
     */
    async post(path: string, data: any, params?: Record<string, string>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.send(path, "POST", params, undefined, data).then((response: T) => {
                resolve(response);
            })
            .catch((error: any) => {
                reject(error);
            });
        });
    }
}