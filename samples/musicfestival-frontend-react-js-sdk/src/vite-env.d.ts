/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly REACT_APP_CG_PREVIEW_URL: string;
    readonly REACT_APP_CONTENT_GRAPH_GATEWAY_URL: string;
    readonly REACT_APP_LOGIN_AUTHORITY: string;
    readonly REACT_APP_LOGIN_CLIENT_ID: string;
    readonly REACT_APP_HEADLESS_FORM_BASE_URL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
