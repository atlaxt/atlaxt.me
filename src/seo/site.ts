export const SITE_NAME = 'Atlas Yiğit Aydın'

export const DEFAULT_TITLE = SITE_NAME

export const DEFAULT_DESCRIPTION = 'Web geliştirici — Vue ekosistemine odaklanan, UX\'e önem veren.'

export const DEFAULT_OG_IMAGE = '/og_image.jpg'

export function getSiteUrl(): string {
  const raw = import.meta.env.VITE_SITE_URL || 'https://atlaxt.me'
  return String(raw).replace(/\/$/, '')
}

export function toAbsoluteUrl(pathOrUrl: string | undefined): string {
  if (!pathOrUrl || typeof pathOrUrl !== 'string')
    return getSiteUrl()
  if (/^https?:\/\//i.test(pathOrUrl))
    return pathOrUrl
  if (pathOrUrl.startsWith('/'))
    return `${getSiteUrl()}${pathOrUrl}`
  return `${getSiteUrl()}/${pathOrUrl}`
}
