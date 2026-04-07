import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')

const CONTENT_DIR = path.join(root, 'content', 'blogs')
const PUBLIC_DIR = path.join(root, 'public')

function getSiteUrl() {
  const raw = process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://atlaxt.me'
  return String(raw).replace(/\/$/, '')
}

function parseFrontmatter(md) {
  const match = md.match(/^---\n([\s\S]*?)\n---\n?/)
  if (!match)
    return { frontmatter: {}, body: md }

  const fm = {}
  for (const line of match[1].split('\n')) {
    const ci = line.indexOf(':')
    if (ci <= 0)
      continue
    const key = line.slice(0, ci).trim()
    const val = line.slice(ci + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key)
      fm[key] = val
  }

  return { frontmatter: fm, body: md.slice(match[0].length) }
}

async function listPosts() {
  let entries = []
  try {
    entries = await fs.readdir(CONTENT_DIR)
  }
  catch {
    return []
  }

  const posts = []
  for (const file of entries) {
    if (!file.endsWith('.md'))
      continue
    const slug = file.replace(/\.md$/, '')
    const full = path.join(CONTENT_DIR, file)
    const raw = await fs.readFile(full, 'utf8')
    const { frontmatter } = parseFrontmatter(raw)
    posts.push({ slug, frontmatter })
  }

  posts.sort((a, b) => String(b.frontmatter.date || '').localeCompare(String(a.frontmatter.date || '')))
  return posts
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function listTools() {
  try {
    const text = await fs.readFile(path.join(root, 'content', 'tools.yaml'), 'utf8')
    const ids = []
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*id:\s*(.+)/)
      if (m)
        ids.push(m[1].trim().replace(/^['"]|['"]$/g, ''))
    }
    return ids
  }
  catch {
    return []
  }
}

function toDate(iso) {
  if (!iso)
    return new Date().toISOString().slice(0, 10)
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? new Date().toISOString().slice(0, 10) : d.toISOString().slice(0, 10)
}

function buildSitemap({ siteUrl, posts, toolIds }) {
  const today = new Date().toISOString().slice(0, 10)

  const staticRoutes = [
    { path: '/',              changefreq: 'weekly',  priority: 1.0 },
    { path: '/blog',         changefreq: 'weekly',  priority: 0.8 },
    { path: '/photos',       changefreq: 'monthly', priority: 0.6 },
    { path: '/books',        changefreq: 'monthly', priority: 0.6 },
    { path: '/feed',         changefreq: 'daily',   priority: 0.4 },
    { path: '/cli',          changefreq: 'monthly', priority: 0.6 },
    { path: '/cli/tools',    changefreq: 'monthly', priority: 0.5 },
    { path: '/cli/templates',changefreq: 'monthly', priority: 0.4 },
  ]

  const urls = [
    ...staticRoutes.map(r => ({
      loc: `${siteUrl}${r.path}`,
      lastmod: r.path === '/blog' && posts[0]?.frontmatter.date
        ? toDate(posts[0].frontmatter.date)
        : today,
      changefreq: r.changefreq,
      priority: r.priority,
    })),
    ...posts.map(p => ({
      loc: `${siteUrl}/blog/${p.slug}`,
      lastmod: toDate(p.frontmatter.date),
      changefreq: 'yearly',
      priority: 0.7,
    })),
    ...toolIds.map(id => ({
      loc: `${siteUrl}/cli/tools/${id}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: 0.5,
    })),
  ]

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(u => [
      '  <url>',
      `    <loc>${xmlEscape(u.loc)}</loc>`,
      `    <lastmod>${xmlEscape(u.lastmod)}</lastmod>`,
      `    <changefreq>${xmlEscape(u.changefreq)}</changefreq>`,
      `    <priority>${xmlEscape(String(u.priority))}</priority>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n')
}

function buildRobots({ siteUrl }) {
  return [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n')
}

async function main() {
  const siteUrl = getSiteUrl()
  const [posts, toolIds] = await Promise.all([listPosts(), listTools()])

  await fs.mkdir(PUBLIC_DIR, { recursive: true })

  const sitemapXml = buildSitemap({ siteUrl, posts, toolIds })
  await fs.writeFile(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapXml, 'utf8')

  const robotsTxt = buildRobots({ siteUrl })
  await fs.writeFile(path.join(PUBLIC_DIR, 'robots.txt'), robotsTxt, 'utf8')

  console.log(`[seo] Generated sitemap.xml (${posts.length} posts, ${toolIds.length} tools) and robots.txt for ${siteUrl}`)
}

main().catch((err) => {
  console.error('[seo] Failed to generate SEO files')
  console.error(err)
  process.exit(1)
})
