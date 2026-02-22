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
    <UPageSection orientation="horizontal" :title="$t('about_me')">
      <template #description>
        <ContentRenderer v-if="data" :value="data" />
      </template>
      <img src="../../assets/me.png" class="rounded">
    </UPageSection>

    <UContainer class="mt-24 mb-2 text-center">
      <i18n-t keypath="books_cta_text" tag="label" class="text-muted" for="books_cta_link">
        <NuxtLink to="/books" class="text-default hover:text-highlighted">
          {{ $t('books_cta_link') }}
        </NuxtLink>
      </i18n-t>
    </UContainer>
  </UPage>
</template>
