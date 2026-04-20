<script setup lang="ts">
import type { TocItem } from '@/composables/usePageContext'
import { computed, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { usePageContext } from '@/composables/usePageContext'
import { getSocial } from '@/data/socials'
import { SITE_NAME, toAbsoluteUrl } from '@/seo/site'
import { useSeo } from '@/seo/useSeo'

function parseHeadings(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([23])\s+id="([^"]+)">(.+?)<\/h[23]>/g
  let m
  while ((m = regex.exec(html)) !== null) {
    const level = Number(m[1]) as 2 | 3
    const id = m[2] ?? ''
    const text = (m[3] ?? '').replace(/<[^>]+>/g, '')
    items.push({ level, id, text })
  }
  return items
}

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
    'sameAs': [getSocial('github').href, getSocial('linkedin').href],
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

const { setSubTitle, setTocItems } = usePageContext()

watch(post, (p) => {
  setSubTitle(p?.frontmatter.title ?? null, '/blog')
  setTocItems(p?.html ? parseHeadings(p.html) : [])
}, { immediate: true })

onUnmounted(() => {
  setSubTitle(null)
  setTocItems([])
})

if (!post.value)
  router.replace('/blog')
</script>

<template>
  <div v-if="post" class="px-2 md:px-0 py-16 w-full">
    <PageHeader class="sticky top-0" :crumbs="[{ label: 'Blog', to: '/blog' }, { label: post.frontmatter.title ?? '' }]" />

    <!-- Kapak görseli -->
    <img
      v-if="post.frontmatter.image"
      :src="post.frontmatter.image ?? ''"
      :alt="post.frontmatter.title ?? ''"
      class="w-full rounded-md mb-10 object-cover"
      style="max-height: 360px;"
    >

    <!-- Başlık -->
    <p class="text-xs tabular-nums mb-4" style="color: var(--text-muted);">
      {{ post.frontmatter.date ? new Date(post.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : '' }}
    </p>
    <h1 class="text-2xl font-semibold mb-4 leading-snug" style="color: var(--text);">
      {{ post.frontmatter.title ?? '' }}
    </h1>
    <p class="text-sm mb-12" style="color: var(--text-muted);">
      {{ post.frontmatter.description ?? '' }}
    </p>

    <!-- İçerik -->
    <div class="post-content" v-html="post.html" />
  </div>
</template>
