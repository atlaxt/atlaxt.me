<script setup lang="ts">
defineProps<{
  link: SocialLink
}>()
</script>

<template>
  <a
    :key="link.name"
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="link.name"
    class="text-xl"
  >
    <Icon :title="link.name" :name="link.icon" />
  </a>
</template>
