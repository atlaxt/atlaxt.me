<script setup lang="ts">
import booksRaw from '@/assets/icons/books.svg?raw'
import githubRaw from '@/assets/icons/github.svg?raw'
import instagramRaw from '@/assets/icons/instagram.svg?raw'
import linkedinRaw from '@/assets/icons/linkedin.svg?raw'
import photosRaw from '@/assets/icons/photos.svg?raw'

const props = defineProps<{ name: 'github' | 'linkedin' | 'instagram' | 'photos' | 'books' }>()

const icons: Record<string, string> = {
  github: githubRaw,
  linkedin: linkedinRaw,
  instagram: instagramRaw,
  photos: photosRaw,
  books: booksRaw,
}
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <span class="social-icon" v-html="icons[props.name]" />
</template>

<style scoped>
.social-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.social-icon :deep(svg) {
  width: 1em;
  height: 1em;
  display: block;
}
</style>
