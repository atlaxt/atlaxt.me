<script setup lang="ts">
import type { TocItem } from '@/composables/usePageContext'
import { computed, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageHeader from '@/components/PageHeader.vue'
import { usePageContext } from '@/composables/usePageContext'
import { useSeo } from '@/seo/useSeo'

function parseHeadings(html: string): TocItem[] {
  const items: TocItem[] = []
  const regex = /<h([23])\s+id="([^"]+)">(.+?)<\/h[23]>/g
  let m
  while ((m = regex.exec(html)) !== null)
    items.push({ level: Number(m[1]) as 2 | 3, id: m[2], text: m[3].replace(/<[^>]+>/g, '') })
  return items
}

interface Note {
  frontmatter: { title: string, description: string, date: string }
  html: string
  slug: string
}

const route = useRoute()
const router = useRouter()

const modules = import.meta.glob('../../content/notes/*.md', { eager: true })
const notes = (Object.values(modules) as { default: Note }[]).map(m => m.default)

const note = computed(() =>
  notes.find(n => n.slug === route.params.slug),
)

useSeo({
  title: computed(() => note.value?.frontmatter.title),
  description: computed(() => note.value?.frontmatter.description),
  canonicalPath: computed(() => note.value ? `/notes/${note.value.slug}` : undefined),
  type: 'article',
})

const { setSubTitle, setTocItems } = usePageContext()

watch(note, (n) => {
  setSubTitle(n?.frontmatter.title ?? null, '/notes')
  setTocItems(n?.html ? parseHeadings(n.html) : [])
}, { immediate: true })

onUnmounted(() => {
  setSubTitle(null)
  setTocItems([])
})

if (!note.value)
  router.replace('/notes')
</script>

<template>
  <div v-if="note" class="px-2 md:px-0 py-16 w-full">
    <PageHeader :crumbs="[{ label: 'Notlar', to: '/notes' }, { label: note.frontmatter.title }]" />

    <p class="text-xs tabular-nums mb-3" style="color: var(--text-muted); opacity: 0.5;">
      {{ new Date(note.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) }}
    </p>
    <h1 class="text-2xl font-semibold mb-3 leading-snug" style="color: var(--text);">
      {{ note.frontmatter.title }}
    </h1>
    <p v-if="note.frontmatter.description" class="text-sm mb-12" style="color: var(--text-muted);">
      {{ note.frontmatter.description }}
    </p>

    <div class="post-content" v-html="note.html" />
  </div>
</template>
