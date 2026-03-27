<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { SITE_NAME, toAbsoluteUrl } from '@/seo/site'
import { useSeo } from '@/seo/useSeo'

interface Post {
  frontmatter: { title: string, description: string, date: string, image?: string }
  html: string
  slug: string
}

const route = useRoute()
const router = useRouter()

const modules = import.meta.glob('../../content/blogs/*.md', { eager: true })
const posts = (Object.values(modules) as { default: Post }[]).map(m => m.default)

const post = computed(() =>
  posts.find(p => p.slug === route.params.slug),
)

const canonicalPath = computed(() => (post.value ? `/blog/${post.value.slug}` : undefined))

const publishedTime = computed(() => {
  const date = post.value?.frontmatter.date
  if (!date)
    return undefined
  const d = new Date(date)
  if (Number.isNaN(d.getTime()))
    return undefined
  return d.toISOString()
})

const jsonLd = computed(() => {
  if (!post.value)
    return undefined

  const headline = post.value.frontmatter.title
  const description = post.value.frontmatter.description
  const image = post.value.frontmatter.image ? toAbsoluteUrl(post.value.frontmatter.image) : undefined
  const url = toAbsoluteUrl(`/blog/${post.value.slug}`)
  const datePublished = publishedTime.value

  const author = {
    '@type': 'Person',
    'name': SITE_NAME,
    'url': 'https://atlaxt.me',
    'sameAs': ['https://github.com/atlaxt', 'https://linkedin.com/in/atlaxt'],
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline,
        description,
        ...(image ? { image: [image] } : {}),
        ...(datePublished ? { datePublished, dateModified: datePublished } : {}),
        'inLanguage': 'tr-TR',
        'mainEntityOfPage': { '@type': 'WebPage', '@id': url },
        author,
        'publisher': author,
      },
      {
        '@type': 'BreadcrumbList',
        'itemListElement': [
          { '@type': 'ListItem', 'position': 1, 'name': 'Ana Sayfa', 'item': 'https://atlaxt.me' },
          { '@type': 'ListItem', 'position': 2, 'name': 'Blog', 'item': 'https://atlaxt.me/blog' },
          { '@type': 'ListItem', 'position': 3, 'name': headline, 'item': url },
        ],
      },
    ],
  }
})

useSeo({
  title: computed(() => post.value?.frontmatter.title),
  description: computed(() => post.value?.frontmatter.description),
  image: computed(() => post.value?.frontmatter.image),
  canonicalPath,
  type: 'article',
  publishedTime,
  modifiedTime: publishedTime,
  jsonLd,
})

if (!post.value)
  router.replace('/blog')
</script>

<template>
  <div v-if="post" class="px-8 py-16 w-full">
    <PageHeader :crumbs="[{ label: 'Blog', to: '/blog' }, { label: post.frontmatter.title }]" />

    <!-- Kapak görseli -->
    <img
      v-if="post.frontmatter.image"
      :src="post.frontmatter.image"
      :alt="post.frontmatter.title"
      class="w-full rounded-md mb-10 object-cover"
      style="max-height: 360px;"
    >

    <!-- Başlık -->
    <p class="text-xs tabular-nums mb-4" style="color: var(--text-muted);">
      {{ new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
    </p>
    <h1 class="text-2xl font-semibold mb-4 leading-snug" style="color: var(--text);">
      {{ post.frontmatter.title }}
    </h1>
    <p class="text-sm mb-12" style="color: var(--text-muted);">
      {{ post.frontmatter.description }}
    </p>

    <!-- İçerik -->
    <div class="post-content" v-html="post.html" />
  </div>
</template>
