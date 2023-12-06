/**
 * Type describing configuration to use when making requests to the Optimizely Headless Form.
 */
export interface ApiClientConfig {
    /**
     * URL to the Optimizely Headless Form API
     */
    baseURL: string;

    /**
     * Collection of header for HTTP request
     */
    headers: Record<string, string>;
}

export const defaultConfig: ApiClientConfig = {
    baseURL: "/",

    headers: {
        "Content-Type": "application/json"
    }
}