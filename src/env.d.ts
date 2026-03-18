/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.yaml' {
  const data: Record<string, string>[]
  export default data
}
declare module '*.yml' {
  const data: Record<string, string>[]
  export default data
}
