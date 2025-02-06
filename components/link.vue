<script setup lang="ts">
const props = defineProps<{
  label: string
  info?: string
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
      class="w-full animation-all flex flex-row gap-2 items-end duration-500 ease-in-out delay-100"
    >
      <p class="whitespace-nowrap">
        {{ props.label }}
      </p>
      <p class="text-xs mb-[2px] w-full">
        {{ props.info }}
      </p>
    </div>

    <div class="flex justify-end gap-4">
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
