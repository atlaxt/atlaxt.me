<script setup lang="ts">
definePageMeta({ name: 'projects' })

const { data: page } = await useAsyncData(
  'projects-page',
  () => queryCollection('projects').first(),
)

const sections = computed(() => {
  if (page.value)
    return Object.entries(page.value.projects) as Array<[string, Array<Record<string, any>>]>
  else
    return []
})
</script>

<template>
  <div class="lg:w-3xl lg:px-0 px-2 flex flex-col gap-6 mx-auto mt-12 content-wrapper">
      <section
        v-for="([key, items]) in sections"
        :id="key"
        :key="key"
        class="flex flex-col gap-6"
      >
      <a :href="`#${key}`" class="text-2xl group relative flex flex-row gap-2 items-center">
        <h2 class="font-semibold tracking-tight">
          {{ formatTitle(key) }}
        </h2>
        <span class="opacity-0 ml-1 group-hover:opacity-80 transition-opacity">#</span>
      </a>
      <div class="flex flex-col gap-4">
        <CardProject
          v-for="item in items"
          :key="item.title"
          :project="item"
        />
      </div>
    </section>
  </div>
</template>
