<script setup lang="ts">
import type { Project } from '~/types'

const props = defineProps<{ project: Project }>()

const faviconUrl = computed<string | undefined>(() => {
  try {
    return new URL('/favicon.ico', props.project.link).toString()
  }
  catch {
    return undefined
  }
})

const showFavicon = ref(false)

function verifyFavicon(): void {
  const url = faviconUrl.value
  if (!url) {
    showFavicon.value = false
    return
  }

  const img = new Image()
  img.onload = () => {
    showFavicon.value = true
  }
  img.onerror = () => {
    showFavicon.value = false
  }
  img.src = url
}

onMounted(verifyFavicon)
watch(faviconUrl, verifyFavicon)
</script>

<template>
  <a
    :href="props.project.link"
    target="_blank"
    rel="noopener noreferrer"
    class="p-3 rounded-lg hover:bg-zinc-100/25 dark:hover:bg-zinc-900/25 transition-colors"
    :aria-label="`Open ${props.project.name}`"
  >
    <div class="flex items-start gap-3">
      <img
        v-if="faviconUrl && showFavicon"
        :src="faviconUrl"
        :alt="`${props.project.name} favicon`"
        class="w-8 h-8 flex-shrink-0 mt-1 object-contain"
        @error="showFavicon = false"
      >
      <Icon
        v-else
        :name="props.project.icon"
        class="text-3xl flex-shrink-0 mt-1"
      />
      <div>
        <h3 class="font-medium text-lg">{{ props.project.name }}</h3>
        <p class="text-zinc-600 dark:text-zinc-400 text-sm">
          {{ props.project.description }}
        </p>
      </div>
    </div>
  </a>
</template>
