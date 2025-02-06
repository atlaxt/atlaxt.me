<script setup lang="ts">
const props = defineProps<{
  label: string
  links: {
    live: string
    github: string
  }
}>()
const isHover = ref<boolean>(false)
</script>

<template>
  <div
    class="relative flex items-center justify-between"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    <div
      :class="{
        'ml-2': isHover,
      }"
      class="w-full animation-all duration-500 ease-in-out delay-100"
    >
      {{ props.label }}
    </div>

    <div class="w-full flex justify-end gap-4">
      <a
        :href="props.links.github"
        target="_blank"
        class="flex items-center gap-2"
      >
        <Icon class="text-lg opacity-70" name="pixelarticons:github-2" />
      </a>

      <a
        :href="props.links.live"
        target="_blank"
        class="flex items-center gap-2"
      >
        <Icon class="text-lg opacity-70" name="pixelarticons:external-link" />
      </a>
    </div>
  </div>
</template>
