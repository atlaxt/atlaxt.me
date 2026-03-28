<script setup lang="ts">
import type { Post } from '@/types'
import PageHeader from '@/components/PageHeader.vue'
import { toAbsoluteUrl } from '@/seo/site'
import { useSeo } from '@/seo/useSeo'

const modules = import.meta.glob('../../content/blogs/*.md', { eager: true })

const posts = (Object.values(modules) as { default: Post }[])
  .map(m => m.default)
  .filter(p => p?.frontmatter)
  .sort((a, b) => b.frontmatter.date?.localeCompare(a.frontmatter.date))

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  'name': 'Blog — Atlas Yiğit Aydın',
  'url': toAbsoluteUrl('/blog'),
  'description': 'Yazılım geliştirme, tasarım ve öğrenme üzerine blog.',
  'inLanguage': 'tr-TR',
  'author': {
    '@type': 'Person',
    'name': 'Atlas Yiğit Aydın',
    'url': 'https://atlaxt.me',
  },
  'blogPost': posts.map(p => ({
    '@type': 'BlogPosting',
    'headline': p.frontmatter.title,
    'description': p.frontmatter.description,
    'datePublished': p.frontmatter.date ? new Date(p.frontmatter.date).toISOString() : '',
    'url': toAbsoluteUrl(`/blog/${p.slug}`),
  })),
}

useSeo({
  title: 'Blog',
  description: 'Yazılım geliştirme, tasarım ve öğrenme üzerine blog.',
  canonicalPath: '/blog',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Blog', to: '/blog' }]" />

    <div class="flex flex-col">
      <RouterLink
        v-for="post in posts"
        :key="post.slug"
        :to="`/blog/${post.slug}`"
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
