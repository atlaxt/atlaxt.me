<script setup lang="ts">
import type { Photo } from '@/types'
import { computed, onUnmounted, ref } from 'vue'
import { useSeo } from '@/seo/useSeo'
import photosRaw from '../../content/photos.yaml'

const photos = photosRaw as unknown as Photo[]

// Dev'de doğrudan, production'da Vercel Image Optimization ile
function thumb(file: string) {
  if (import.meta.env.DEV)
    return `/photos/${file}`
  return `/_vercel/image?url=${encodeURIComponent(`/photos/${file}`)}&w=800&q=75`
}

function full(file: string) {
  if (import.meta.env.DEV)
    return `/photos/${file}`
  return `/_vercel/image?url=${encodeURIComponent(`/photos/${file}`)}&w=1920&q=85`
}

// Lightbox
const lightboxIndex = ref<number | null>(null)

const currentPhoto = computed(() => {
  const i = lightboxIndex.value
  if (i === null)
    return null
  return photos[i] ?? null
})

const currentNumber = computed(() => {
  if (lightboxIndex.value === null)
    return 0
  return lightboxIndex.value + 1
})

function open(i: number) {
  lightboxIndex.value = i
  document.body.style.overflow = 'hidden'
}

function close() {
  lightboxIndex.value = null
  document.body.style.overflow = ''
}

function onKey(e: KeyboardEvent) {
  if (lightboxIndex.value === null)
    return
  if (!photos.length) {
    close()
    return
  }
  if (e.key === 'ArrowLeft')
    lightboxIndex.value = (lightboxIndex.value - 1 + photos.length) % photos.length
  else if (e.key === 'ArrowRight')
    lightboxIndex.value = (lightboxIndex.value + 1) % photos.length
  else
    close()
}

window.addEventListener('keydown', onKey)
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})

useSeo({
  title: 'Fotoğraflar',
  description: 'Objektifimden kareler.',
  canonicalPath: '/photos',
  type: 'website',
})
</script>

<template>
  <div class="px-8 py-8">
    <!-- Masonry grid -->
    <div v-if="photos.length" class="masonry-grid">
      <button
        v-for="(photo, i) in photos"
        :key="photo.file"
        class="masonry-item group"
        @click="open(i)"
      >
        <img
          :src="thumb(photo.file)"
          :alt="photo.alt ?? photo.file"
          class="no-drag w-full block transition-opacity duration-300 group-hover:opacity-80"
          loading="lazy"
          decoding="async"
          draggable="false"
          @dragstart.prevent
        >
      </button>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lb">
        <div
          v-if="currentPhoto"
          class="fixed inset-0 z-50 flex items-center justify-center"
          style="background: rgba(0,0,0,0.92); backdrop-filter: blur(8px);"
          @click="close"
        >
          <!-- Fotoğraf -->
          <img
            :src="full(currentPhoto.file)"
            :alt="currentPhoto.alt ?? currentPhoto.file"
            class="no-drag max-h-[90vh] max-w-[90vw] object-contain"
            draggable="false"
            @dragstart.prevent
          >

          <!-- Sayaç -->
          <span class="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs" style="color: rgba(255,255,255,0.3);">
            {{ currentNumber }} / {{ photos.length }}
          </span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.masonry-grid {
  columns: 3 220px;
  gap: 8px;
}

.masonry-item {
  position: relative;
  display: block;
  break-inside: avoid;
  margin-bottom: 8px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
}

@media (max-width: 640px) {
  .masonry-grid {
    columns: 2 160px;
  }
}

/* Lightbox transition */
.lb-enter-active,
.lb-leave-active {
  transition: opacity 0.2s ease;
}
.lb-enter-from,
.lb-leave-to {
  opacity: 0;
}

.no-drag {
  -webkit-user-drag: none;
  user-select: none;
}
</style>
