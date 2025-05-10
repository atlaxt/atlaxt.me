<script setup lang="ts">
import photos from '../photos/index'

definePageMeta({
  name: 'photos',
})

const selectedPhotoIndex = ref<number | null>(null)

function openPhoto(index: number) {
  selectedPhotoIndex.value = index
}

function closePhoto() {
  selectedPhotoIndex.value = null
}

function nextPhoto() {
  if (selectedPhotoIndex.value === null)
    return
  selectedPhotoIndex.value = (selectedPhotoIndex.value + 1) % photos.length
}

function prevPhoto() {
  if (selectedPhotoIndex.value === null)
    return
  selectedPhotoIndex.value = (selectedPhotoIndex.value - 1 + photos.length) % photos.length
}

// const photos = Object.values(import.meta.glob('../assets/photos/*.{jpg,jpeg}', {
//   eager: true,
//   import: 'default',
// })) as string[]
</script>

<template>
  <div class="px-4 pb-12 w-full h-full overflow-y-auto mt-12">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="max-h-[500px] overflow-hidden flex"
        @click="openPhoto(index)"
      >
        <CardPhoto :photo="photo" />
      </div>
    </div>

    <ModalPhotoViewer
      v-if="selectedPhotoIndex !== null"
      :photo="photos[selectedPhotoIndex]"
      :is-open="selectedPhotoIndex !== null"
      :on-close="closePhoto"
      :on-next="nextPhoto"
      :on-prev="prevPhoto"
    />
  </div>
</template>
