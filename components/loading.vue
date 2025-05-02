<script setup lang="ts">
const loadingItems = ['|', '/', '-', '\\']
const index = ref(0)

let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  intervalId = setInterval(() => {
    index.value = (index.value + 1) % loadingItems.length
  }, 150)
})

onUnmounted(() => {
  clearInterval(intervalId)
})
</script>

<template>
  <span class="text-xs mb-1">{{ loadingItems[index] }}</span>
</template>
