<script setup lang="ts">
import type { ToolEntry } from '@/types'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useReadmeCache } from '@/composables/useReadmeCache'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import toolsRaw from '../../../content/tools.yaml'

const tools = toolsRaw as unknown as ToolEntry[]

const route = useRoute()
const tool = computed(() => tools.find(t => t.id === route.params.id))

const html = ref<string | null>(null)
const error = ref(false)

const { getReadme, cache } = useReadmeCache()

async function load(pkg: string) {
  error.value = false
  html.value = cache.value[pkg] ?? null
  const result = await getReadme(pkg)
  if (result)
    html.value = result
  else error.value = true
}

watch(
  () => tool.value?.package,
  (pkg) => {
    if (pkg)
      load(pkg)
  },
  { immediate: true },
)

useSeo({
  title: `${route.params.id} — atlaxt CLI`,
  description: tool.value?.desc ?? '',
  canonicalPath: `/cli/tools/${route.params.id}`,
  type: 'website',
  noindex: true,
})
</script>

<template>
  <CliLayout>
    <div v-if="tool">
      <!-- Başlık -->
      <div class="flex items-center justify-between mb-8" style="border-bottom: 1px solid var(--border); padding-bottom: 0.75rem;">
        <p class="text-lg font-mono font-semibold" style="color: var(--text);">
          {{ tool.package }}
        </p>
        <a
          :href="`https://www.npmjs.com/package/${tool.package}`"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xs transition-opacity hover:opacity-60"
          style="color: var(--text-muted);"
        >npm ↗</a>
      </div>

      <!-- Loading -->
      <p v-if="!html && !error" class="text-xs" style="color: var(--text-muted); opacity: 0.4;">
        yükleniyor...
      </p>
      <p v-else-if="error" class="text-xs" style="color: var(--text-muted); opacity: 0.4;">
        README yüklenemedi.
      </p>

      <div v-else class="cli-readme text-sm leading-relaxed" v-html="html" />
    </div>

    <p v-else class="text-sm" style="color: var(--text-muted);">
      Tool bulunamadı.
    </p>
  </CliLayout>
</template>
