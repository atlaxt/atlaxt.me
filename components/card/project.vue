<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{
  project: Project
}>()
</script>

<template>
  <a
    :href="props.project.link"
    target="_blank"
    rel="noopener noreferrer"
    class="p-3 rounded-lg hover:bg-zinc-100/25 dark:hover:bg-zinc-900/25 transition-colors"
  >
    <div class="flex items-start gap-3">
      <Icon :name="props.project.icon" class="text-2xl flex-shrink-0 mt-1" />
      <div>
        <h3 class="font-medium text-lg">{{ props.project.name }}</h3>
        <p class="text-zinc-600 dark:text-zinc-400 text-sm">{{ props.project.description }}</p>
      </div>
    </div>
  </a>
</template>
