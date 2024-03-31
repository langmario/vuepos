/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIRECTUS_HOST: string;
    readonly VITE_DIRECTUS_TOKEN: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
