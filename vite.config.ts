import { fileURLToPath, URL } from 'node:url'
import { readFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// Minimal YAML plugin — list-of-objects formatını destekler
function yamlPlugin(): Plugin {
  return {
    name: 'vite-yaml',
    transform(_src, id) {
      if (!id.endsWith('.yaml') && !id.endsWith('.yml')) return

      const text = readFileSync(id, 'utf-8')
      const result: Record<string, string>[] = []
      let current: Record<string, string> | null = null

      for (const raw of text.split('\n')) {
        const line = raw.trimEnd()
        if (!line.trim() || line.trim().startsWith('#') || line.trim() === '---') continue

        if (/^\s*-\s+/.test(line)) {
          current = {}
          result.push(current)
          const rest = line.replace(/^\s*-\s+/, '')
          if (rest.includes(':')) {
            const ci = rest.indexOf(':')
            current[rest.slice(0, ci).trim()] = rest.slice(ci + 1).trim().replace(/^["']|["']$/g, '')
          }
        } else if (current && line.includes(':')) {
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

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueDevTools(),
    yamlPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
