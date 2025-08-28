<script setup lang="ts">
defineProps<{
  to: string
  label?: string
  icon: string
}>()

const route = useRoute()
const currentRouteName = computed(() => route.name)
</script>

<template>
  <RouterLink
    class="opacity-70 hover:opacity-100 flex flex-row items-center gap-2 duration-300"
    :class="{
      'opacity-100': currentRouteName === to,
    }"
    :to="{ name: to }"
    aria-label="View projects"
  >
    <Icon class="text-xl" :name="icon" aria-hidden="true" />
    <span v-if="label" class="md:flex hidden md:text-md text-sm"> {{ label }} </span>
  </RouterLink>
</template>
