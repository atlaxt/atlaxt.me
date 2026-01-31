<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()

const { data } = await useAsyncData(async () => {
  const collection = (`projects_${locale.value}`) as keyof Pick<Collections, 'projects_en' | 'projects_tr'>
  return await queryCollection(collection).first()
}, { watch: [locale] })
</script>

<template>
  <UPage>
    <UPageSection :title="$t('projects')" :description="$t('projects_desc')" />

    <UPageList>
      <UPageCard
        v-for="(project, index) in (data?.meta.body as Project[])"
        :key="index"
        variant="ghost"
        :to="project.link"
        target="_blank"
        :title="project.name"
        :description="project.description"
        :ui="{ root: 'rounded-none' }"
      >
        <template #leading>
          <img :src="`${project.link}/favicon.ico`" class="h-6">
        </template>
      </UPageCard>
    </UPageList>
  </UPage>
</template>
