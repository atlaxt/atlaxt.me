<script setup lang="ts">
import { ref, computed } from 'vue'
import booksRaw from '../../content/books.yaml'

interface Book {
  number: string
  code:   string
  name:   string
  author: string
  rate:   string
}

const books  = (booksRaw as Book[]).filter(b => b.name)
const search = ref('')

const filtered = computed(() => {
  const q = search.value.toLowerCase().trim()
  if (!q) return books
  return books.filter(b =>
    b.name?.toLowerCase().includes(q) || b.author?.toLowerCase().includes(q)
  )
})
</script>

<template>
  <div class="px-8 py-16">

    <!-- Başlık satırı -->
    <div class="flex items-baseline justify-between mb-10">
      <span class="text-xs tracking-widest uppercase" style="color: var(--text-muted);">
        Kitaplık
        <span class="ml-2 opacity-50">{{ filtered.length }}</span>
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
        />
      </div>
    </div>

    <!-- Liste -->
    <div class="flex flex-col">
      <div
        v-for="book in filtered"
        :key="book.number"
        class="flex items-baseline justify-between py-3 border-b"
        style="border-color: var(--border);"
      >
        <div class="flex items-baseline gap-4 min-w-0">
          <span class="text-xs shrink-0 w-6 text-right tabular-nums" style="color: var(--text-muted); opacity: 0.3;">
            {{ book.number }}
          </span>
          <span class="text-sm" style="color: var(--text);">{{ book.name }}</span>
          <span class="text-xs shrink-0 hidden sm:inline" style="color: var(--text-muted);">{{ book.author }}</span>
        </div>
        <span
          v-if="book.rate"
          class="text-xs shrink-0 ml-6 tabular-nums"
          style="color: var(--text-muted);"
        >
          {{ book.rate }} / 10
        </span>
      </div>

      <p v-if="!filtered.length" class="text-sm py-8" style="color: var(--text-muted);">
        Sonuç bulunamadı.
      </p>
    </div>
  </div>
</template>
