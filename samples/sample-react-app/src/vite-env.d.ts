/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_ENDPOINT_GET_FORM_BY_PAGE_URL: string;
    readonly REACT_APP_HEADLESS_FORM_BASE_URL?: string;
    readonly REACT_APP_AUTH_BASEURL?: string;
    readonly REACT_APP_CONTENT_GRAPH_GATEWAY_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
