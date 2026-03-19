<script setup lang="ts">
import type { Post } from '@/types'
import { useSeo } from '@/seo/useSeo'

const modules = import.meta.glob('../../content/blogs/*.md', { eager: true })

const posts = (Object.values(modules) as { default: Post }[])
  .map(m => m.default)
  .filter(p => p?.frontmatter)
  .sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date))

useSeo({
  title: 'Yazılar',
  description: 'Blog yazıları ve notlar.',
  canonicalPath: '/writings',
  type: 'website',
})
</script>

<template>
  <div class="px-8 py-16">
    <p class="text-xs tracking-widest uppercase mb-12" style="color: var(--text-muted);">
      Yazılar
    </p>

    <div class="flex flex-col">
      <RouterLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/writings/${post.slug}`"
        class="flex flex-col py-6 border-b transition-opacity hover:opacity-70"
        style="border-color: var(--border);"
      >
        <div class="flex items-baseline justify-between gap-8 mb-1">
          <span class="text-sm font-medium" style="color: var(--text);">
            {{ post.frontmatter.title }}
          </span>
          <span class="text-xs shrink-0 tabular-nums" style="color: var(--text-muted);">
            {{ new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
          </span>
        </div>
        <p class="text-xs leading-relaxed" style="color: var(--text-muted);">
          {{ post.frontmatter.description }}
        </p>
      </RouterLink>
    </div>
  </div>
</template>
