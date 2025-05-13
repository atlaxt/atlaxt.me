<script setup lang="ts">
import type { Photo } from '~/types'

const props = defineProps<{
  photo: Photo
}>()
</script>

<template>
  <img
    :src="props.photo.url"
    class="max-h-[500px] object-cover hover:scale-105 transition-transform duration-300 select-none"
    :draggable="false"
    :alt="props.photo.name"
  >
</template>
