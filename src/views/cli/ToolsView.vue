<script setup lang="ts">
import type { ToolEntry } from '@/types'
import { onMounted } from 'vue'
import CliCommand from '@/components/CliCommand.vue'
import ContentRow from '@/components/ContentRow.vue'
import { useReadmeCache } from '@/composables/useReadmeCache'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import toolsRaw from '../../../content/tools.yaml'

const tools = toolsRaw as unknown as ToolEntry[]
const { cache, preloadAll } = useReadmeCache()

onMounted(() => {
  preloadAll(tools.map(t => t.package))
})

useSeo({
  title: 'Tools — atlaxt CLI',
  description: 'atlaxt CLI araçları.',
  canonicalPath: '/cli/tools',
  type: 'website',
  noindex: true,
})
</script>

<template>
  <CliLayout>
    <h1 class="text-lg font-semibold mb-3" style="color: var(--text);">
      Tools
    </h1>
    <p class="text-sm leading-relaxed mb-6" style="color: var(--text-muted);">
      CLI içine gömdüğüm küçük araçlar. Her biri bağımsız olarak da kullanılabilir,
      tek bir iş yapar ve iyi yapar.
    </p>

    <CliCommand class="mb-10" npm="npx atlaxt tools" pnpm="pnpx atlaxt tools" />

    <div class="flex flex-col" style="border-top: 1px solid var(--border);">
      <ContentRow
        v-for="tool in tools"
        :key="tool.id"
        :to="`/cli/tools/${tool.id}`"
        :title="tool.package"
        :desc="tool.desc"
        :mono="true"
      >
        <div
          v-if="cache[tool.package]"
          class="relative mt-6 overflow-hidden"
          style="max-height: 6em; mask-image: linear-gradient(to bottom, black 30%, transparent 100%); -webkit-mask-image: linear-gradient(to bottom, black 30%, transparent 100%);"
        >
          <div class="cli-readme text-xs leading-relaxed" style="color: var(--text-muted); opacity: 0.4;" v-html="cache[tool.package]" />
        </div>
      </ContentRow>
    </div>
  </CliLayout>
</template>
