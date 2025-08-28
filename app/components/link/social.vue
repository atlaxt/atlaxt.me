<script setup lang="ts">
defineProps<{
  name: string
  url: string
  icon: string
}>()
</script>

<template>
  <a
    :key="url"
    class="opacity-70 hover:opacity-100 duration-300 flex items-center"
    target="_blank"
    :href="url"
    :aria-label="`Go to ${name} profile`"
  >
    <Icon class="text-lg" :name="icon" aria-hidden="true" />
  </a>
</template>
