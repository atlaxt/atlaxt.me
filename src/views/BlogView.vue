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

const grouped = (() => {
  const map = new Map<number, Post[]>()
  for (const post of posts) {
    const year = new Date(post.frontmatter.date).getFullYear()
    if (!map.has(year))
      map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].sort((a, b) => b[0] - a[0])
})()

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

    <div class="page-intro">
      <p class="t-page-title">
        Bir konuyu konuşmak veya bir bilgiyi aktarmak istediğimde burdayım.
      </p>
    </div>

    <div class="year-list">
      <div
        v-for="[year, yearPosts] in grouped"
        :key="year"
        class="year-group"
      >
        <span class="year-label" aria-hidden="true">{{ year }}</span>
        <div class="year-posts">
          <RouterLink
            v-for="post in yearPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="post-row"
          >
            <div class="flex items-baseline justify-between gap-8 mb-1">
              <span class="text-sm font-medium" style="color: var(--text);">
                {{ post.frontmatter.title }}
              </span>
              <span class="post-date text-xs shrink-0 tabular-nums" style="color: var(--text-muted);">
                {{ new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { month: 'long', day: 'numeric' }) }}
              </span>
            </div>
            <p class="text-xs leading-relaxed" style="color: var(--text-muted);">
              {{ post.frontmatter.description }}
            </p>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-intro {
  margin-bottom: 2rem;
}


.year-list {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.year-group {
  position: relative;
}

.year-label {
  position: absolute;
  top: -0.122em;
  left: -0.04em;
  font-size: 7rem;
  font-family: 'Alumni Sans Pinstripe', sans-serif;
  font-weight: 400;
  line-height: 1;
  letter-spacing: 0.02em;
  color: var(--text);
  opacity: 0.12;
  pointer-events: none;
  user-select: none;
  z-index: 0;
  max-height: 4.5rem;
  overflow: hidden;
}

.year-posts {
  position: relative;
  z-index: 1;
  padding-top: 3.9rem;
}

.post-row {
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border);
  background: transparent;
  text-decoration: none;
}

.post-date {
  opacity: 0.55;
}

.post-row:hover span,
.post-row:hover p {
  opacity: 0.5;
  transition: opacity 0.15s ease;
}
</style>
