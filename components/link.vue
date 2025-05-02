<script setup lang="ts">
const props = defineProps<{
  label: string
  info?: string
  disabled?: boolean
  loading?: boolean
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
    @mouseenter="() => {
      if (!props.disabled)
        isHover = true
    }"
    @mouseleave="isHover = false"
  >
    <div
      :class="{
        'ml-2': isHover,
      }"
      class="select-none w-full animation-all flex flex-row gap-2 items-end duration-500 ease-in-out delay-100"
    >
      <Loading v-if="props.loading" />
      <p
        :class="{
          'text-green-400': isHover,
          'text-red-500 opacity-95': props.disabled,
        }" class="whitespace-nowrap animation-all duration-500 ease-in-out delay-100"
      >
        {{ props.label }}
      </p>
      <p
        class="text-xs mb-[2px] w-full"
      >
        {{ props.info }}
      </p>
    </div>

    <div class="flex justify-end gap-4">
      <a
        :href="props.links.github"
        target="_blank"
        class="flex items-center gap-2 animation-all duration-500 ease-in-out delay-100"
        :class="{
          'opacity-100': isHover,
          'opacity-60': !isHover,
        }"
      >
        <Icon class="text-lg opacity-70" name="pixelarticons:github" />
      </a>

      <a
        v-if="props.links.live"
        :href="props.links.live"
        target="_blank"
        class="flex items-center gap-2 animation-all duration-500 ease-in-out delay-100"
        :class="{
          'opacity-100': isHover,
          'opacity-60': !isHover,
        }"
      >
        <Icon class="text-lg opacity-70" name="pixelarticons:external-link" />
      </a>
    </div>
  </div>
</template>
