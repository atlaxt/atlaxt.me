<script setup lang="ts">
defineProps<{
  book: Book
}>()
</script>

<template>
  <div
    class="p-3 flex flex-row justify-between rounded-lg hover:bg-zinc-100/25 dark:hover:bg-zinc-900/25 transition-colors"
    :class="{
      'opacity-50': !book.isRead,
    }"
  >
    <h1 class="font-medium whitespace-nowrap text-lg">
      <span class="text-sm opacity-70 mr-1"> {{ book.number }}. </span>
      {{ book.name }}
      <span class="text-sm opacity-70">
        {{ book.author }}
      </span>
    </h1>
    <div v-if="book.isRead" class="flex items-end font-bold whitespace-nowrap">
      <span> {{ `${book.rate}/10` }} </span>
    </div>
  </div>
</template>
