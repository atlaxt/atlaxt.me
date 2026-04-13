/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:photos' {
  import type { Photo } from '@/types'

  const photos: Photo[]
  export default photos
}

declare module '*.yaml' {
  const data: Record<string, string>[]
  export default data
}
declare module '*.yml' {
  const data: Record<string, string>[]
  export default data
}
