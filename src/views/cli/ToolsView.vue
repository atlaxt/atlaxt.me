<script setup lang="ts">
import type { ToolEntry } from '@/types'
import CliCommand from '@/components/CliCommand.vue'
import ContentRow from '@/components/ContentRow.vue'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import toolsRaw from '../../../content/tools.yaml'

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
      />
    </div>
  </CliLayout>
</template>
