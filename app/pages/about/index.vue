<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()

const { data } = await useAsyncData(async () => {
  const collection = (`about_${locale.value}`) as keyof Pick<Collections, 'about_tr' | 'about_en'>
  return await queryCollection(collection).first()
}, { watch: [locale] })
</script>

<template>
  <UPage>
    <UPageSection :title="$t('about_me')">
      <template #description>
        <ContentRenderer v-if="data" :value="data" />
      </template>
      <!-- <img src="../../assets/me.png" class="rounded"> -->
    </UPageSection>
  </UPage>
</template>
