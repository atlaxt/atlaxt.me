import type { ComputedRef } from 'vue'
import { useHead } from '@unhead/vue'
import { computed, isRef } from 'vue'
import { useRoute } from 'vue-router'
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  toAbsoluteUrl,
} from './site'

export interface SeoOptions {
  title?: string | ComputedRef<string | undefined>
  description?: string | ComputedRef<string | undefined>
  image?: string | ComputedRef<string | undefined>
  type?: 'website' | 'article'
  canonicalPath?: string | ComputedRef<string | undefined>
  publishedTime?: string | ComputedRef<string | undefined>
  modifiedTime?: string | ComputedRef<string | undefined>
  jsonLd?: Record<string, any> | ComputedRef<Record<string, any> | undefined>
  noindex?: boolean
}

function unwrap<T>(v: T | ComputedRef<T>): T {
  return isRef(v) ? v.value : v
}

export function useSeo(options: SeoOptions = {}) {
  const route = useRoute()

  const canonical = computed(() => {
    const canonicalPath = unwrap(options.canonicalPath)
    const path = canonicalPath || route.path
    return toAbsoluteUrl(path)
  })

  const title = computed(() => {
    const rawTitle = unwrap(options.title)
    const t = rawTitle?.trim()
    if (!t || t === SITE_NAME)
      return DEFAULT_TITLE
    return `${t} — ${SITE_NAME}`
  })

  const description = computed(() => {
    const d = unwrap(options.description)
    return (d && d.trim()) || DEFAULT_DESCRIPTION
  })

  const image = computed(() => {
    const img = unwrap(options.image)
    const imagePath = (img && img.trim()) || DEFAULT_OG_IMAGE
    return toAbsoluteUrl(imagePath)
  })

  const type = computed(() => options.type || 'website')

  useHead(() => {
    const robotsContent = options.noindex ? 'noindex, nofollow' : 'index, follow'

    const meta: any[] = [
      { name: 'description', content: description.value },
      { name: 'author', content: SITE_NAME },
      { name: 'robots', content: robotsContent },
      // Open Graph
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:title', content: title.value },
      { property: 'og:description', content: description.value },
      { property: 'og:type', content: type.value },
      { property: 'og:url', content: canonical.value },
      { property: 'og:locale', content: 'tr_TR' },
      // Twitter / X
      { name: 'twitter:title', content: title.value },
      { name: 'twitter:description', content: description.value },
      { name: 'twitter:card', content: image.value ? 'summary_large_image' : 'summary' },
      { name: 'twitter:creator', content: '@atlaxt' },
      { name: 'twitter:site', content: '@atlaxt' },
    ]

    if (image.value) {
      meta.push({ property: 'og:image', content: image.value })
      meta.push({ property: 'og:image:alt', content: title.value })
      meta.push({ property: 'og:image:width', content: '1200' })
      meta.push({ property: 'og:image:height', content: '630' })
      meta.push({ name: 'twitter:image', content: image.value })
      meta.push({ name: 'twitter:image:alt', content: title.value })
    }

    const publishedTime = unwrap(options.publishedTime)
    const modifiedTime = unwrap(options.modifiedTime)
    if (type.value === 'article') {
      if (publishedTime)
        meta.push({ property: 'article:published_time', content: publishedTime })
      if (modifiedTime)
        meta.push({ property: 'article:modified_time', content: modifiedTime })
      meta.push({ property: 'article:author', content: 'https://atlaxt.me' })
    }

    const jsonLd = unwrap(options.jsonLd)

    return {
      title: title.value,
      htmlAttrs: { lang: 'tr' },
      link: [{ rel: 'canonical', href: canonical.value }],
      meta,
      script: jsonLd
        ? [{ type: 'application/ld+json', children: JSON.stringify(jsonLd) }]
        : [],
    }
  })

  return { canonical, title, description, image }
}
