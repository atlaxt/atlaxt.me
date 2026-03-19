<script setup lang="ts">
import CliCommand from '@/components/CliCommand.vue'
import CliLayout from '@/layouts/CliLayout.vue'
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: 'atlaxt CLI',
  description: 'atlaxt — kendi geliştirdiğim CLI. Proje şablonları ve araçlar.',
  canonicalPath: '/cli',
  type: 'website',
})
</script>

<template>
  <CliLayout>
    <h1 class="text-lg font-semibold font-mono mb-4" style="color: var(--text);">
      atlaxt
    </h1>

    <p class="text-sm leading-relaxed mb-10" style="color: var(--text-muted);">
      Kendi geliştirdiğim CLI. Proje şablonlarını tek komutla GitHub'dan klonlar,
      aynı zamanda işe yarayan küçük araçları barındırır.
    </p>

    <div class="mb-10">
      <div class="flex flex-col gap-3">
        <!-- Tavsiye edilen -->
        <div>
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-xs px-1.5 py-0.5 font-medium" style="background: var(--text); color: var(--bg);">Tavsiye edilen</span>
            <span class="text-xs" style="color: var(--text-muted); opacity: 0.5;">indirmeden kullan</span>
          </div>
          <CliCommand label="Kurulum" npm="npx atlaxt" pnpm="pnpx atlaxt" />
        </div>

        <!-- Global kurulum -->
        <div class="mt-1">
          <p class="text-xs mb-2" style="color: var(--text-muted); opacity: 0.4;">
            global kurulum
          </p>
          <CliCommand npm="npm i -g atlaxt" pnpm="pnpm add -g atlaxt" />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <RouterLink
        to="/cli/tools"
        class="group flex items-center justify-between px-4 py-3 text-sm transition-opacity hover:opacity-70"
        style="border: 1px solid var(--border); color: var(--text);"
      >
        <span>Tools</span>
        <span style="color: var(--text-muted);">→</span>
      </RouterLink>
      <RouterLink
        to="/cli/templates"
        class="group flex items-center justify-between px-4 py-3 text-sm transition-opacity hover:opacity-70"
        style="border: 1px solid var(--border); color: var(--text);"
      >
        <span>Templates</span>
        <span style="color: var(--text-muted);">→</span>
      </RouterLink>
    </div>
  </CliLayout>
</template>
