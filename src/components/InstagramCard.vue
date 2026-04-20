<script setup lang="ts">
defineProps<{
  id: string
  caption?: string
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM'
  media_url: string
  permalink: string
}>()

// function truncate(text: string, max = 100) {
//   return text.length > max ? `${text.slice(0, max)}…` : text
// }
</script>

<template>
  <a
    :href="permalink"
    target="_blank"
    rel="noopener noreferrer"
    class="group block overflow-hidden transition-opacity hover:opacity-80"
    style="border: 1px solid var(--border);"
  >
    <div class="relative aspect-square overflow-hidden bg-neutral-900">
      <video
        v-if="media_type === 'VIDEO'"
        :src="media_url"
        muted
        loop
        playsinline
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        @mouseenter="($el as HTMLVideoElement).play()"
        @mouseleave="($el as HTMLVideoElement).pause()"
      />
      <img
        v-else
        :src="media_url"
        :alt="caption"
        loading="lazy"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      >
      <span
        v-if="media_type === 'VIDEO'"
        class="absolute top-2 right-2 label-micro px-1.5 py-0.5"
        style="background: rgba(0,0,0,0.6); color: var(--text-muted);"
      >
        ▶
      </span>
      <span
        v-else-if="media_type === 'CAROUSEL_ALBUM'"
        class="absolute top-2 right-2 label-micro px-1.5 py-0.5"
        style="background: rgba(0,0,0,0.6); color: var(--text-muted);"
      >
        ⧉
      </span>
    </div>

  </a>
</template>
