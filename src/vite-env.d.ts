/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_WS_BASE_URL: string;
  readonly VITE_IDLE_TIMEOUT_OPERATOR_MS: string;
  readonly VITE_IDLE_TIMEOUT_SUPERADMIN_MS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

