<script setup lang="ts">
defineProps<{
  label: string
}>()
const model = defineModel()
</script>

<template>
  <button class="flex dark:text-zinc-600 text-zinc-500 flex-row items-center gap-1" @click="model = !model">
    <div
      class="
    w-4 h-4 rounded border dark:border-zinc-700 border-zinc-400 flex justify-center items-center
    "
    >
      <Icon v-if="model" name="lucide:check" />
    </div>
    {{ label }}
  </button>
</template>
