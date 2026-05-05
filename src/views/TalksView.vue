<script setup lang="ts">
import type { Talk } from '@/types'
import { onMounted, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'

useSeo({
  title: 'Konuşmalar',
  description: 'Konuşmalar.',
  canonicalPath: '/talks',
  type: 'website',
})

const talks = ref<Talk[]>([
  {
    title: 'Doğumundan Bugüne Yapay Zeka, Doğru AI Doğru Prompt',
    date: '2026-05-08',
    location: 'İstanbul, Marmara Üniversitesi',
    url: 'https://talks.atlaxt.me/2026/biyolojik-bilimler-kulubu-yapay-zeka/',
    shortUrl: '/2026/biyolojik-bilimler-kulubu-yapay-zeka',
  },
])
const error = ref<string | null>(null)

onMounted(async () => {
  try {
    // const res = await fetch('https://talks.atlaxt.me/talks.json')
    // if (!res.ok)
    //   throw new Error(`${res.status} ${res.statusText}`)
    // talks.value = await res.json()
  }
  catch (e) {
    error.value = String(e)
  }
})

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Konuşmalar', to: '/talks' }]" />

    <div v-if="talks.length" class="talks-list">
      <a
        v-for="talk in talks"
        :key="talk.shortUrl"
        :href="talk.url"
        target="_blank"
        rel="noopener noreferrer"
        class="talk-row"
      >
        <div class="talk-row-accent" />

        <div class="talk-row-inner">
          <div class="talk-top">
            <div class="talk-title-row">
              <span class="talk-title">{{ talk.title }}</span>
              <span v-if="talk.lang" class="talk-lang">{{ talk.lang }}</span>
            </div>

            <div class="talk-actions" @click.prevent>
              <a
                v-if="talk.slides"
                :href="talk.slides"
                target="_blank"
                rel="noopener noreferrer"
                class="talk-action"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect width="18" height="14" x="3" y="3" rx="2" />
                  <path d="M7 21h10M12 17v4" />
                </svg>
                Slides
              </a>
              <a
                v-if="talk.pdf"
                :href="talk.pdf"
                target="_blank"
                rel="noopener noreferrer"
                class="talk-action"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 17V3M6 11l6 6 6-6" />
                  <path d="M3 21h18" />
                </svg>
                PDF
              </a>
            </div>
          </div>

          <p class="talk-meta">
            {{ formatDate(talk.date) }} · {{ talk.location }}
          </p>
        </div>
      </a>
    </div>

    <p v-else-if="error" class="text-sm mt-8" style="color: var(--text-muted); opacity: 0.5;">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
.talks-list {
  display: flex;
  flex-direction: column;
  margin-top: 2rem;
}

.talk-row {
  position: relative;
  display: block;
  padding: 1.4rem 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  overflow: hidden;
  transition: padding-left 0.2s ease;
}

.talk-row:first-child {
  border-top: 1px solid var(--border);
}

.talk-row:hover {
  padding-left: 0.9rem;
}

.talk-row-accent {
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

.talk-row:hover .talk-row-accent {
  opacity: 0.35;
  transform: scaleY(1);
}

.talk-row-inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.talk-top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 2rem;
}

.talk-title-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  min-width: 0;
  flex-wrap: wrap;
}

.talk-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text);
  line-height: 1.4;
  transition: opacity 0.15s ease;
}

.talk-lang {
  font-size: 0.63rem;
  letter-spacing: 0.04em;
  color: var(--text-muted);
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  padding: 0.1rem 0.4rem;
  opacity: 0.75;
  flex-shrink: 0;
  transition: opacity 0.15s ease;
}

.talk-meta {
  font-size: 0.72rem;
  color: var(--text-muted);
  opacity: 0.5;
  transition: opacity 0.15s ease;
}

.talk-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.talk-action {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.68rem;
  letter-spacing: 0.03em;
  color: var(--text-muted);
  text-decoration: none;
  opacity: 0.45;
  transition: opacity 0.15s ease;
}

.talk-action:hover {
  opacity: 1;
}

.talk-row:hover .talk-title,
.talk-row:hover .talk-lang,
.talk-row:hover .talk-meta {
  opacity: 0.5;
}
</style>
