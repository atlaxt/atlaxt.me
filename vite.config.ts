import type { Plugin } from 'vite'
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'

import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const __dirname = dirname(fileURLToPath(import.meta.url))

function yamlPlugin(): Plugin {
  return {
    name: 'vite-yaml',
    transform(_src, id) {
      if (!id.endsWith('.yaml') && !id.endsWith('.yml'))
        return

      const text = readFileSync(id, 'utf-8')
      const result: Record<string, string>[] = []
      let current: Record<string, string> | null = null

      for (const raw of text.split('\n')) {
        const line = raw.trimEnd()
        if (!line.trim() || line.trim().startsWith('#') || line.trim() === '---')
          continue

        if (/^\s*-\s+/.test(line)) {
          current = {}
          result.push(current)
          const rest = line.replace(/^\s*-\s+/, '')
          if (rest.includes(':')) {
            const ci = rest.indexOf(':')
            current[rest.slice(0, ci).trim()] = rest.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
          }
        }
        else if (current && line.includes(':')) {
          const ci = line.indexOf(':')
          const key = line.slice(0, ci).trim()
          const val = line.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
          current[key] = val
        }
      }

      return `export default ${JSON.stringify(result)}`
    },
  }
}

// Inline dönüşümler: bold, italic, code, link
function inlineHtml(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/==(.+?)==/g, '<span class="hl-wrap">$1</span>')
}

// Basit Markdown → HTML dönüştürücü
function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false
  let inTable = false
  let tableBody = false

  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i]
    const trimmed = raw.trim()

    // Başlıklar
    const h3 = trimmed.match(/^### (.+)/)
    const h2 = trimmed.match(/^## (.+)/)
    const h1 = trimmed.match(/^# (.+)/)
    if (h1) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      out.push(`<h1>${inlineHtml(h1[1])}</h1>`)
      continue
    }
    if (h2) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      out.push(`<h2>${inlineHtml(h2[1])}</h2>`)
      continue
    }
    if (h3) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      out.push(`<h3>${inlineHtml(h3[1])}</h3>`)
      continue
    }

    // Tablo
    if (trimmed.startsWith('|')) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim())
      if (!inTable) {
        out.push(`<table><thead><tr>${cells.map(c => `<th>${inlineHtml(c)}</th>`).join('')}</tr></thead>`)
        inTable = true
        tableBody = false
      }
      else if (!tableBody && cells.every(c => /^[-: ]+$/.test(c))) {
        out.push('<tbody>')
        tableBody = true
      }
      else {
        out.push(`<tr>${cells.map(c => `<td>${inlineHtml(c)}</td>`).join('')}</tr>`)
      }
      continue
    }
    else if (inTable) {
      if (tableBody)
        out.push('</tbody>')
      out.push('</table>')
      inTable = false
      tableBody = false
    }

    // Yatay çizgi
    if (/^-{3,}$/.test(trimmed)) {
      if (inList) {
        out.push('</ul>')
        inList = false
      }
      out.push('<hr>')
      continue
    }

    // Liste
    if (/^\*\s+/.test(trimmed)) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inlineHtml(trimmed.replace(/^\*\s+/, ''))}</li>`)
      continue
    }
    else if (inList) {
      out.push('</ul>')
      inList = false
    }

    // Boş satır
    if (!trimmed)
      continue

    // Paragraf
    out.push(`<p>${inlineHtml(trimmed)}</p>`)
  }

  if (inList)
    out.push('</ul>')
  if (inTable) {
    if (tableBody)
      out.push('</tbody>')
    out.push('</table>')
  }

  return out.join('\n')
}

// Photo meta plugin — thumbnail boyutlarından landscape hesaplar
function photoMetaPlugin(): Plugin {
  const VIRTUAL = 'virtual:photo-meta'
  const RESOLVED = `\0${VIRTUAL}`

  return {
    name: 'vite-photo-meta',
    resolveId(id) {
      if (id === VIRTUAL)
        return RESOLVED
    },
    async load(id) {
      if (id !== RESOLVED)
        return

      const thumbDir = resolve(__dirname, 'public/photos/thumbs')
      if (!existsSync(thumbDir))
        return `export default {}`

      const files = readdirSync(thumbDir).filter(f => /\.(jpg|jpeg|png)$/i.test(f))
      const meta: Record<string, boolean> = {}

      const sharp = (await import('sharp')).default
      for (const file of files) {
        const { width = 0, height = 0 } = await sharp(resolve(thumbDir, file)).metadata()
        meta[file] = width > height
      }

      return `export default ${JSON.stringify(meta)}`
    },
  }
}

// Markdown plugin — frontmatter + html export
function mdPlugin(): Plugin {
  return {
    name: 'vite-md',
    transform(_src, id) {
      if (!id.endsWith('.md'))
        return

      const text = readFileSync(id, 'utf-8').replace(/\r\n/g, '\n')
      const slug = id.split('/').pop()!.replace('.md', '')

      // Frontmatter parse
      const fmMatch = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/)
      const frontmatter: Record<string, string> = {}
      let content = text

      if (fmMatch) {
        for (const line of fmMatch[1].split('\n')) {
          const ci = line.indexOf(':')
          if (ci > 0) {
            frontmatter[line.slice(0, ci).trim()] = line.slice(ci + 1).trim().replace(/^['"]|['"]$/g, '')
          }
        }
        content = fmMatch[2]
      }

      const html = mdToHtml(content)

      return `export default ${JSON.stringify({ frontmatter, html, slug })}`
    },
  }
}

// ─── Ortak yardımcılar ────────────────────────────────────────────────────────

function parseFrontmatter(text: string): Record<string, string> {
  const fm: Record<string, string> = {}
  const fmMatch = text.replace(/\r\n/g, '\n').match(/^---\n([\s\S]*?)\n---/)
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const ci = line.indexOf(':')
      if (ci > 0)
        fm[line.slice(0, ci).trim()] = line.slice(ci + 1).trim().replace(/^['"]|['"]$/g, '')
    }
  }
  return fm
}

function parseYamlList(text: string): Record<string, string>[] {
  const result: Record<string, string>[] = []
  let current: Record<string, string> | null = null
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    if (!line.trim() || line.trim().startsWith('#'))
      continue
    if (/^\s*-\s+/.test(line)) {
      current = {}
      result.push(current)
      const rest = line.replace(/^\s*-\s+/, '')
      if (rest.includes(':')) {
        const ci = rest.indexOf(':')
        current[rest.slice(0, ci).trim()] = rest.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
      }
    }
    else if (current && line.includes(':')) {
      const ci = line.indexOf(':')
      current[line.slice(0, ci).trim()] = line.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
    }
  }
  return result
}

function getBlogPosts() {
  const blogsDir = resolve(__dirname, 'content/blogs')
  return readdirSync(blogsDir)
    .filter(f => f.endsWith('.md'))
    .map((file) => {
      const text = readFileSync(resolve(blogsDir, file), 'utf-8')
      const slug = file.replace('.md', '')
      return { slug, frontmatter: parseFrontmatter(text) }
    })
    .filter(p => p.frontmatter.date)
    .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))
}

function getToolIds(): string[] {
  const text = readFileSync(resolve(__dirname, 'content/tools.yaml'), 'utf-8')
  return parseYamlList(text).map(t => t.id).filter(Boolean)
}

// ─── Sitemap + robots ─────────────────────────────────────────────────────────

function sitemapPlugin(): Plugin {
  const SITE = 'https://atlaxt.me'

  function toDate(iso?: string): string {
    if (!iso)
      return new Date().toISOString().slice(0, 10)
    const d = new Date(iso)
    return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10)
  }

  return {
    name: 'vite-sitemap',
    buildStart() {
      const posts = getBlogPosts()
      const toolIds = getToolIds()
      const today = new Date().toISOString().slice(0, 10)

      interface UrlEntry { loc: string, lastmod: string, changefreq: string, priority: number }
      const urls: UrlEntry[] = [
        { loc: `${SITE}/`, lastmod: today, changefreq: 'weekly', priority: 1.0 },
        { loc: `${SITE}/blog`, lastmod: toDate(posts[0]?.frontmatter.date), changefreq: 'weekly', priority: 0.8 },
        { loc: `${SITE}/photos`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: `${SITE}/books`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: `${SITE}/feed`, lastmod: today, changefreq: 'daily', priority: 0.4 },
        { loc: `${SITE}/cli`, lastmod: today, changefreq: 'monthly', priority: 0.6 },
        { loc: `${SITE}/cli/tools`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
        { loc: `${SITE}/cli/templates`, lastmod: today, changefreq: 'monthly', priority: 0.4 },
        ...posts.map(p => ({
          loc: `${SITE}/blog/${p.slug}`,
          lastmod: toDate(p.frontmatter.date),
          changefreq: 'yearly',
          priority: 0.7,
        })),
        ...toolIds.map(id => ({
          loc: `${SITE}/cli/tools/${id}`,
          lastmod: today,
          changefreq: 'monthly',
          priority: 0.5,
        })),
      ]

      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(u => [
          '  <url>',
          `    <loc>${u.loc}</loc>`,
          `    <lastmod>${u.lastmod}</lastmod>`,
          `    <changefreq>${u.changefreq}</changefreq>`,
          `    <priority>${u.priority}</priority>`,
          '  </url>',
        ].join('\n')),
        '</urlset>',
      ].join('\n')

      const robots = `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`

      writeFileSync(resolve(__dirname, 'public/sitemap.xml'), xml, 'utf-8')
      writeFileSync(resolve(__dirname, 'public/robots.txt'), robots, 'utf-8')
    },
  }
}

// ─── RSS ──────────────────────────────────────────────────────────────────────

function rssPlugin(): Plugin {
  function generateRss(): string {
    const posts = getBlogPosts()

    const siteUrl = 'https://atlaxt.me'
    const items = posts.map(p => `
    <item>
      <title><![CDATA[${p.frontmatter.title ?? p.slug}]]></title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.frontmatter.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.frontmatter.description ?? ''}]]></description>
    </item>`).join('')

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Atlas Yiğit Aydın</title>
    <link>${siteUrl}</link>
    <description>Web geliştirici — Vue ekosistemine odaklanan, UX'e önem veren.</description>
    <language>tr-TR</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`
  }

  return {
    name: 'vite-rss',
    buildStart() {
      writeFileSync(resolve(__dirname, 'public/rss.xml'), generateRss(), 'utf-8')
    },
  }
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    // vueDevTools(),
    yamlPlugin(),
    mdPlugin(),
    photoMetaPlugin(),
    sitemapPlugin(),
    rssPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
