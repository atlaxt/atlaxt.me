<script setup lang="ts">
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import toolsRaw from '../../content/tools.yaml'

interface ToolEntry { id: string; package: string; desc: string }
const tools = toolsRaw as unknown as ToolEntry[]

useSeo({
  title: 'Tools — atlaxt CLI',
  description: 'atlaxt CLI araçları.',
  canonicalPath: '/cli/tools',
  type: 'website',
})
</script>

<template>
  <CliLayout>
    <h1 class="text-lg font-semibold mb-3" style="color: var(--text);">Tools</h1>
    <p class="text-sm leading-relaxed mb-10" style="color: var(--text-muted);">
      CLI içine gömdüğüm küçük araçlar. Her biri bağımsız olarak da kullanılabilir,
      tek bir iş yapar ve iyi yapar.
    </p>

    <div class="flex flex-col" style="border-top: 1px solid var(--border);">
      <RouterLink
        v-for="tool in tools"
        :key="tool.id"
        :to="`/cli/tools/${tool.id}`"
        class="flex items-start justify-between gap-6 py-5 transition-opacity hover:opacity-60"
        style="border-bottom: 1px solid var(--border); color: var(--text);"
      >
        <div>
          <p class="text-sm font-mono font-medium mb-1">{{ tool.package }}</p>
          <p class="text-xs leading-relaxed" style="color: var(--text-muted);">{{ tool.desc }}</p>
        </div>
        <span class="text-sm shrink-0 mt-0.5" style="color: var(--text-muted);">→</span>
      </RouterLink>
    </div>
  </CliLayout>
</template>
