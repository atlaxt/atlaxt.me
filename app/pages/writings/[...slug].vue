<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const route = useRoute()
const { locale } = useI18n()

// const slugParam = computed(() => Array.isArray(route.params.slug) ? route.params.slug.join('/') : route.params.slug)

const { data: page } = await useAsyncData(async () => {
  const collection = (`${route.query.write}_tr`) as keyof Pick<Collections, 'blogs_tr'>
  return await queryCollection(collection).first()
}, { watch: [locale] })

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>

<template>
  <UPage class="mt-10">
    <UContainer v-if="page?.meta.body">
      <ULink
        :to="{
          path: '/writings',
          query: route.query,
        }"
        class="text-sm flex items-center gap-1"
      >
        <UIcon name="lucide:chevron-left" />
        Blog
      </ULink>
      <div class="flex flex-col gap-3 mt-8">
        <div class="flex text-xs text-muted items-center justify-center gap-2">
          <span v-if="page.date">
            {{ formatDate(page.date) }}
          </span>
          <!-- <span v-if="page.date && page.minRead">
            -
          </span>
          <span v-if="page.minRead">
            {{ page.minRead }} MIN READ
          </span> -->
        </div>
        <img
          :src="page.image"
          :alt="page.title"
          class="rounded-lg w-full h-75 object-cover object-center"
        >
        <h1 class="text-4xl text-center font-medium max-w-3xl mx-auto mt-4">
          {{ page.title }}
        </h1>
        <p class="text-muted text-center max-w-2xl mx-auto">
          {{ page.description }}
        </p>
        <div class="flex items-center justify-center gap-2 mt-2">
          <UUser
            orientation="vertical"
            color="neutral"
            variant="outline"
            class="justify-center items-center text-center"
            :avatar="{
              alt: 'Atlas Yiğit Aydın',
              src: 'https://avatars.githubusercontent.com/u/137510980?v=4',
            }"
            name="Atlas Yiğit Aydın"
          />
        </div>
      </div>
      <ContentRenderer class="mt-24" :value="page.meta.body" />
    </UContainer>
  </UPage>
</template>
