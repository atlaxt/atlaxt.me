export const SITE_NAME = 'Atlas Yiğit Aydın'

export const DEFAULT_TITLE = SITE_NAME

export const DEFAULT_DESCRIPTION = "Web geliştirici — Nuxt ekosistemine odaklanan, UX'e önem veren."

export function getSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL || 'https://atlaxt.me'
  return String(raw).replace(/\/$/, '')
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return pathOrUrl
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (pathOrUrl.startsWith('/')) return `${getSiteUrl()}${pathOrUrl}`
  return `${getSiteUrl()}/${pathOrUrl}`
}
