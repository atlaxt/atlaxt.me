import type { IncomingMessage, ServerResponse } from 'node:http'
import { parse } from 'node:url'

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const { query } = parse(req.url ?? '', true)
  const url = query.url as string | undefined

  if (!url) {
    res.statusCode = 400
    res.end('url param required')
    return
  }

  try {
    const upstream = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; RSS Reader)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10_000),
    })

    const body = await upstream.text()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Content-Type', upstream.headers.get('content-type') ?? 'application/xml')
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.statusCode = 200
    res.end(body)
  }
  catch {
    res.statusCode = 502
    res.end('upstream fetch failed')
  }
}
