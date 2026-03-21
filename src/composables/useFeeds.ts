import type { FeedItem } from '@/types'

export type { FeedItem }

function parseXml(text: string): Document {
  return new DOMParser().parseFromString(text, 'application/xml')
}

function text(el: Element, tag: string): string {
  return el.querySelector(tag)?.textContent?.trim() ?? ''
}

function attr(el: Element, tag: string, attribute: string): string {
  return el.querySelector(tag)?.getAttribute(attribute) ?? ''
}

function parseItems(xml: Document, sourceName: string, sourceLink: string): FeedItem[] {
  const items: FeedItem[] = []

  // RSS
  const rssItems = xml.querySelectorAll('item')
  if (rssItems.length) {
    rssItems.forEach((item) => {
      const title = text(item, 'title')
      const link = text(item, 'link') || attr(item, 'link', 'href')
      const pub = text(item, 'pubDate') || text(item, 'dc\\:date')
      if (title && link)
        items.push({ title, link, date: new Date(pub || Date.now()), source: sourceName, sourceLink })
    })
    return items
  }

  // Atom
  xml.querySelectorAll('entry').forEach((entry) => {
    const title = text(entry, 'title')
    const link = attr(entry, 'link[rel="alternate"]', 'href') || attr(entry, 'link', 'href')
    const pub = text(entry, 'published') || text(entry, 'updated')
    if (title && link)
      items.push({ title, link, date: new Date(pub || Date.now()), source: sourceName, sourceLink })
  })
  return items
}

const DEV_PROXIES = [
  (url: string) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url: string) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
]

async function fetchRaw(url: string): Promise<string | null> {
  // Production: use our own Vercel serverless function (no CORS issues)
  if (import.meta.env.PROD) {
    try {
      const res = await fetch(`/api/feed?url=${encodeURIComponent(url)}`, {
        signal: AbortSignal.timeout(12_000),
      })
      if (res.ok)
        return await res.text()
    }
    catch {}
    return null
  }

  // Dev: fall back to public CORS proxies
  for (const makeProxy of DEV_PROXIES) {
    try {
      const res = await fetch(makeProxy(url), { signal: AbortSignal.timeout(8000) })
      if (!res.ok)
        continue
      const contentType = res.headers.get('content-type') ?? ''
      if (contentType.includes('application/json')) {
        const { contents } = await res.json()
        return contents
      }
      return await res.text()
    }
    catch {
      continue
    }
  }
  return null
}

export async function fetchFeed(url: string, sourceName: string, sourceLink: string): Promise<FeedItem[]> {
  try {
    const contents = await fetchRaw(url)
    if (!contents)
      return []
    return parseItems(parseXml(contents), sourceName, sourceLink)
  }
  catch {
    return []
  }
}
