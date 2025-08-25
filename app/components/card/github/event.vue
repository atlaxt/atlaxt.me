<script setup lang="ts">
defineProps<{
  event: GitHubEvent
}>()
</script>

<template>
  <div>
    {{ event.type }} - {{ event.repo.name }} - {{ new Date(event.created_at).toLocaleDateString() }}
  </div>
</template>
