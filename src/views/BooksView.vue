<script setup lang="ts">
import type { Book } from '@/types'
import { computed, ref } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useSeo } from '@/seo/useSeo'
import booksRaw from '../../content/books.yaml'

const books = (booksRaw as unknown as Book[]).filter(b => b.name)
const search = ref('')
const sortDir = ref<'desc' | 'asc' | null>(null)

function toggleSort() {
  if (sortDir.value === null)
    sortDir.value = 'desc'
  else if (sortDir.value === 'desc')
    sortDir.value = 'asc'
  else sortDir.value = null
}

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  const result = q
    ? books.filter(b => b.name?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q))
    : [...books]

  if (sortDir.value === 'desc') {
    result.sort((a, b) => {
      if (!a.rate && !b.rate)
        return 0
      if (!a.rate)
        return 1
      if (!b.rate)
        return -1
      return Number.parseFloat(b.rate) - Number.parseFloat(a.rate)
    })
  }
  else if (sortDir.value === 'asc') {
    result.sort((a, b) => {
      if (!a.rate && !b.rate)
        return 0
      if (!a.rate)
        return 1
      if (!b.rate)
        return -1
      return Number.parseFloat(a.rate) - Number.parseFloat(b.rate)
    })
  }

  return result
})

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  'name': 'Kitaplık — Atlas Yiğit Aydın',
  'description': 'Okuduğum kitaplar ve puanlarım.',
  'url': 'https://atlaxt.me/books',
  'numberOfItems': books.length,
  'itemListElement': books.map((b, i) => ({
    '@type': 'ListItem',
    'position': i + 1,
    'name': b.name,
  })),
}

useSeo({
  title: 'Kitaplık',
  description: `Okuduğum ${books.length}+ kitap ve puanlarım. Modern klasiklerin hepsini okumayı hedefliyorum.`,
  canonicalPath: '/books',
  type: 'website',
  jsonLd,
})
</script>

<template>
  <div class="px-2 md:px-0 py-16">
    <PageHeader :crumbs="[{ label: 'Kitaplık', to: '/books' }]" />

    <div class="page-intro">
      <p class="t-page-title mb-[0.3rem]">
        Bütün modern klasikleri okumayı hedefliyorum.
      </p>
      <p class="t-small">
        Okuduklarımı burada puanlıyorum.
      </p>
    </div>

    <!-- Arama satırı -->
    <div class="flex items-baseline justify-between mb-10">
      <span class="text-xs" style="color: var(--text-muted); opacity: 0.4;">
        {{ filtered.length }} kitap
      </span>

      <div class="flex items-baseline gap-6">
        <input
          v-model="search"
          type="text"
          placeholder="ara"
          class="text-xs bg-transparent outline-none text-right w-24 placeholder-current transition-opacity"
          :style="{
            color: 'var(--text-muted)',
            opacity: search ? '1' : '0.5',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '1px',
          }"
        >
      </div>
    </div>

    <!-- Kolon başlıkları -->
    <div class="flex items-baseline justify-between pb-2 mb-1" style="border-bottom: 1px solid var(--border);">
      <span class="text-xs" style="color: var(--text-muted); opacity: 0.4;">kitap</span>
      <button
        class="sort-btn text-xs"
        :class="{ 'sort-btn--active': sortDir !== null }"
        @click="toggleSort"
      >
        puan
        <span class="sort-icon">{{ sortDir === 'desc' ? '↓' : sortDir === 'asc' ? '↑' : '↕' }}</span>
      </button>
    </div>

    <!-- Liste -->
    <div class="flex flex-col">
      <a
        v-for="book in filtered"
        :key="book.number"
        :href="`https://www.google.com/search?q=${book.code}`"
        target="_blank"
        rel="noopener noreferrer"
        class="book-row flex items-start justify-between py-3 border-b"
        style="border-color: var(--border);"
      >
        <div class="flex items-start gap-4 min-w-0">
          <span class="text-xs shrink-0 w-6 text-right tabular-nums mt-0.5" style="color: var(--text-muted); opacity: 0.3;">
            {{ book.number }}
          </span>
          <div class="flex flex-col gap-0.5 min-w-0">
            <span class="text-sm" style="color: var(--text);">{{ book.name }}</span>
            <span class="text-xs" style="color: var(--text-muted); opacity: 0.6;">{{ book.author }}</span>
          </div>
        </div>
        <span
          v-if="book.rate"
          class="text-xs shrink-0 ml-6 tabular-nums mt-0.5"
          style="color: var(--text-muted);"
        >
          {{ book.rate }} / 10
        </span>
      </a>

      <p v-if="!filtered.length" class="text-sm py-8" style="color: var(--text-muted);">
        Sonuç bulunamadı.
      </p>
    </div>
  </div>
</template>

<style scoped>
.page-intro {
  margin-bottom: 2rem;
}

.sort-btn {
  display: flex;
  align-items: baseline;
  gap: 0.3rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-muted);
  opacity: 0.4;
  transition: opacity 0.15s ease;
  padding: 0;
}

.sort-btn:hover {
  opacity: 0.75;
}

.sort-btn--active {
  opacity: 0.85;
}

.sort-icon {
  font-size: 0.6rem;
}

.book-row {
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.book-row:hover {
  opacity: 0.7;
}
</style>
