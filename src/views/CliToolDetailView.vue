<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import { mdToHtml } from '@/composables/useMarkdown'
import toolsRaw from '../../content/tools.yaml'

interface ToolEntry { id: string; package: string; desc: string }
const tools = toolsRaw as unknown as ToolEntry[]

const route = useRoute()
const tool  = computed(() => tools.find(t => t.id === route.params.id))

const html  = ref<string | null>(null)
const error = ref(false)

async function fetchReadme(pkg: string): Promise<string | null> {
  try {
    const encoded = pkg.replace(/^@/, '%40').replace(/\//, '%2F')
    const res = await fetch(`https://registry.npmjs.org/${encoded}`)
    if (!res.ok) return null
    const json = await res.json()
    return json.readme ?? null
  } catch {
    return null
  }
}

onMounted(async () => {
  if (!tool.value) return
  const readme = await fetchReadme(tool.value.package)
  if (readme) html.value = mdToHtml(readme)
  else error.value = true
})

useSeo({
  title: `${route.params.id} — atlaxt CLI`,
  description: tool.value?.desc ?? '',
  canonicalPath: `/cli/tools/${route.params.id}`,
  type: 'website',
})
</script>

<template>
  <CliLayout>
    <div v-if="tool">
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-8" style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
        <p class="text-lg font-mono font-semibold" style="color: var(--text);">{{ tool.package }}</p>
        <a
          :href="`https://www.npmjs.com/package/${tool.package}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs transition-opacity hover:opacity-60"
          style="color: var(--text-muted);"
        >npm ↗</a>
      </div>

      <!-- Loading -->
      <p v-if="!html && !error" class="text-xs" style="color: var(--text-muted); opacity: 0.4;">yükleniyor...</p>
      <p v-else-if="error"      class="text-xs" style="color: var(--text-muted); opacity: 0.4;">README yüklenemedi.</p>

      <div v-else class="cli-readme text-sm leading-relaxed" v-html="html" />
    </div>

    <p v-else class="text-sm" style="color: var(--text-muted);">Tool bulunamadı.</p>
  </CliLayout>
</template>

<style>
.cli-readme h1 { display: none; }
.cli-readme h2 { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2rem; margin-bottom: 0.75rem; opacity: 0.5; color: var(--text-muted); }
.cli-readme h3 { font-size: 0.875rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.5rem; color: var(--text); }
.cli-readme h4 { font-size: 0.8rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.4rem; color: var(--text-muted); }
.cli-readme p  { color: var(--text-muted); margin-bottom: 0.75rem; }
.cli-readme a  { color: var(--text); text-decoration: underline; text-underline-offset: 3px; opacity: 0.7; }
.cli-readme a:hover { opacity: 1; }
.cli-readme pre { background: var(--bg-subtle); padding: 0.75rem 1rem; margin: 1rem 0; overflow-x: auto; }
.cli-readme pre code { font-size: 0.75rem; color: var(--text); background: none; padding: 0; }
.cli-readme code { font-size: 0.75rem; background: var(--bg-subtle); padding: 0.1em 0.35em; color: var(--text); }
.cli-readme ul, .cli-readme ol { padding-left: 1.25rem; margin-bottom: 0.75rem; color: var(--text-muted); }
.cli-readme li { margin-bottom: 0.3rem; }
.cli-readme hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
</style>
