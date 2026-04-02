import type { Plugin } from 'vite'
import { existsSync, readdirSync, readFileSync } from 'node:fs'

import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import vueDevTools from 'vite-plugin-vue-devtools'

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

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    // vueDevTools(),
    yamlPlugin(),
    mdPlugin(),
    photoMetaPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
