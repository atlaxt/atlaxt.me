<script setup lang="ts">
import type { Template } from '@/types'
import CliCommand from '@/components/CliCommand.vue'
import ContentRow from '@/components/ContentRow.vue'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'
import templatesRaw from '../../../content/templates.yaml'

const templates = templatesRaw as unknown as Template[]

useSeo({
  title: 'Templates — atlaxt CLI',
  description: 'atlaxt CLI proje şablonları.',
  canonicalPath: '/cli/templates',
  type: 'website',
  noindex: true,
})
</script>

<template>
  <CliLayout>
    <h1 class="text-lg font-semibold mb-3" style="color: var(--text);">
      Templates
    </h1>
    <p class="text-sm leading-relaxed mb-6" style="color: var(--text-muted);">
      Şablonlar GitHub'daki kendi repolarımdan otomatik klonlanır, proje adı vererek başlatılır.
    </p>

    <CliCommand class="mb-10" npm="npx atlaxt templates" pnpm="pnpx atlaxt templates" />

    <div class="flex flex-col" style="border-top: 1px solid var(--border);">
      <ContentRow
        v-for="tpl in templates"
        :key="tpl.name"
        :href="tpl.href"
        :title="tpl.name"
        :desc="tpl.desc"
        :mono="true"
        arrow="↗"
      />
    </div>
  </CliLayout>
</template>
