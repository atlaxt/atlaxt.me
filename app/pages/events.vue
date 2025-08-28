<script setup lang="ts">
definePageMeta({ name: 'events' })

const { events, fetchEvents, loading } = useEvents()

onMounted(async () => {
  await fetchEvents()
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

    <CardGithubEventTimeline :events="events" />

    <!-- <div class="flex flex-col mt-12 gap-4">
      <CardGithubEventItem
        v-for="(event, key) in events"
        :key="key"
        :event="event"
      />
    </div> -->

    <div v-if="loading" class="text-center my-4">
      loading...
    </div>
  </div>
</template>
