<script setup lang="ts">
import type { Collections } from '@nuxt/content'

import type { TabsItem } from '@nuxt/ui'

const items = computed<TabsItem[]>(() => [
  {
    label: $t('blogs'),
    value: 'blogs',
  },
  {
    label: $t('notes'),
    value: 'notes',
    disabled: true,
  },
])
const active = ref('blogs')

const { locale } = useI18n()

const { data } = await useAsyncData(async () => {
  const collection = (`${active.value}`) as keyof Pick<Collections, 'blogs'>
  return await queryCollection(collection).order('date', 'DESC').all()
}, { watch: [locale, active] })
</script>

<template>
  <UPage>
    <UPageSection :title="$t('writings')" :description="$t('writings_desc')" />
    <UTabs v-model="active" variant="link" color="neutral" :content="false" :items="items" />

    <UContainer class="mt-4">
      <UBlogPosts v-if="data" orientation="vertical">
        <UBlogPost
          v-for="(post, index) in data"
          :key="`post-${index}`"
          v-bind="post"
          orientation="horizontal"
          :to="{
            path: `/writings/${post.stem.split('/')[1]}`,
            query: { write: active },
          }"
          :authors="[
            {
              name: 'Atlas Yiğit Aydın',
              avatar: {
                alt: 'Atlas Yiğit Aydın',
                src: 'https://avatars.githubusercontent.com/u/137510980?v=4',
              },
            },
          ]"
        />
      </UBlogPosts>
    </UContainer>
  </UPage>
</template>
