<script setup lang="ts">
const { events, fetchEvents, loading } = useEvents()

onMounted(() => {
  fetchEvents()
})
</script>

<template>
  <div class="lg:w-3xl lg:px-0 px-2 mx-auto mt-12 content-wrapper">
    <h1 class="mt-2">
      Events
    </h1>
    <p class="mt-8">
      description
    </p>

    <div class="flex flex-col mt-12 gap-4">
      <CardGithubEvent
        v-for="(event, key) in events"
        :key="key"
        :event="event"
      />
    </div>

    <div v-if="loading" class="text-center my-4">
      loading...
    </div>
  </div>
</template>
