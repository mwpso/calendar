/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string
  readonly VITE_APP_YEAR_START: string
  readonly VITE_APP_YEAR_END: string
}
interface ImportMeta {
  readonly env: ImportMetaEnv
}