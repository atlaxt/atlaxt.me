<script setup lang="ts">
import photos from '../../photos/index'

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
</script>

<template>
  <div class="px-12 pb-12 w-full h-full overflow-y-auto mt-12">
    <div class="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
      <div
        v-for="(photo, index) in photos"
        :key="index"
        class="overflow-hidden"
        @click="openPhoto(index)"
      >
        <CardPhoto :photo="photo" />
      </div>
    </div>

    <ModalPhotoViewer
      v-if="selectedPhotoIndex !== null"
      :photo="photos[selectedPhotoIndex] ?? undefined"
      :is-open="selectedPhotoIndex !== null"
      :on-close="closePhoto"
      :on-next="nextPhoto"
      :on-prev="prevPhoto"
    />
  </div>
</template>
