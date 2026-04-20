<script setup lang="ts">
import type { Post } from '@/types'
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'

const modules = import.meta.glob('../../content/notes/*.md', { eager: true })

const notes = (Object.values(modules) as { default: Post & { html: string } }[])
  .map(m => m.default)
  .filter(n => n?.frontmatter)
  .sort((a, b) => b.frontmatter.date?.localeCompare(a.frontmatter.date))

useSeo({
  title: 'Notlar',
  description: 'Kişisel notlar, rehberler ve dağınık bilgi hazinesi.',
  canonicalPath: '/notes',
  type: 'website',
})
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Notlar', to: '/notes' }]" />

    <div v-if="notes.length" class="notes-list">
      <RouterLink
        v-for="note in notes"
        :key="note.slug"
        :to="`/notes/${note.slug}`"
        class="note-card"
      >
        <div class="note-card-inner">
          <div class="note-card-header">
            <span class="note-title">{{ note.frontmatter.title }}</span>
            <span class="note-date tabular-nums">
              {{ new Date(note.frontmatter.date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' }) }}
            </span>
          </div>
          <p v-if="note.frontmatter.description" class="note-desc">
            {{ note.frontmatter.description }}
          </p>
        </div>
        <div class="note-card-accent" />
      </RouterLink>
    </div>

    <p v-else class="text-sm py-8" style="color: var(--text-muted); opacity: 0.5;">
      Henüz not yok.
    </p>
  </div>
</template>

<style scoped>
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.note-card {
  position: relative;
  display: block;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  overflow: hidden;
  transition: padding-left 0.2s ease;
}

.note-card-inner {
  position: relative;
  z-index: 1;
}

.note-card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--text-muted);
  opacity: 0;
  transform: scaleY(0.4);
  transition: opacity 0.2s ease, transform 0.2s ease;
  transform-origin: center;
}

.note-card:hover {
  padding-left: 0.9rem;
}

.note-card:hover .note-card-accent {
  opacity: 0.35;
  transform: scaleY(1);
}

.note-card-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 0.4rem;
}

.note-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  transition: opacity 0.15s ease;
  line-height: 1.4;
}

.note-date {
  font-size: 0.7rem;
  color: var(--text-muted);
  opacity: 0.5;
  flex-shrink: 0;
  white-space: nowrap;
  transition: opacity 0.15s ease;
}

.note-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.6;
  opacity: 0.7;
  transition: opacity 0.15s ease;
}

.note-card:hover .note-title,
.note-card:hover .note-date,
.note-card:hover .note-desc {
  opacity: 0.5;
}
</style>
