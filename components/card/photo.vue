<script setup lang="ts">
import type { Photo } from '~/types'

const props = defineProps<{
  photo: Photo
}>()
</script>

<template>
  <img
    :src="props.photo.url"
    class="w-full aspect-square object-cover hover:scale-105 transition-transform duration-300 select-none"
    :draggable="false"
    width="260"
    height="260"
    loading="lazy"
    :alt="props.photo.name"
  >
</template>
