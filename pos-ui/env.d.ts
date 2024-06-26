/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIRECTUS_HOST: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
