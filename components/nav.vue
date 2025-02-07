<script setup lang="ts">
const props = defineProps<{
  label: string
}>()
</script>

<template>
  <p
    class="cursor-pointer"
  >
    {{ props.label }}
  </p>
</template>
