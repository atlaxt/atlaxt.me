<script setup lang="ts">
import type { Photo } from '~/types'

const props = defineProps<{
  photo: Photo | undefined
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}>()

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape')
    props.onClose()
  if (e.key === 'ArrowRight')
    props.onNext()
  if (e.key === 'ArrowLeft')
    props.onPrev()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div v-if="props.isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
    <button
      class="absolute top-4 z-60 right-4 text-white hover:text-gray-300"
      @click="props.onClose"
    >
      <Icon name="lucide:x" class="w-8 h-8" />
    </button>

    <button
      class="absolute left-4 z-60 text-white hover:text-gray-300"
      @click="props.onPrev"
    >
      <Icon name="lucide:chevron-left" class="w-12 h-12" />
    </button>

    <button
      class="absolute right-4 z-60 text-white hover:text-gray-300"
      @click="props.onNext"
    >
      <Icon name="lucide:chevron-right" class="w-12 h-12" />
    </button>

    <!-- Photo -->
    <div class="relative w-full h-full flex items-center justify-center p-8">
      <img
        :src="props.photo?.url"
        :alt="props.photo?.name"
        :draggable="false"
        class="max-w-full max-h-full w-auto h-auto object-contain select-none"
      >
    </div>
  </div>
</template>
