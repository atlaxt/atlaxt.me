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

export async function fetchFeed(url: string, sourceName: string, sourceLink: string): Promise<FeedItem[]> {
  try {
    const proxy = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const res = await fetch(proxy)
    if (!res.ok)
      return []
    const { contents } = await res.json()
    return parseItems(parseXml(contents), sourceName, sourceLink)
  }
  catch {
    return []
  }
}
