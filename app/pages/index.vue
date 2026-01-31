<script setup lang="ts">
import type { Collections } from '@nuxt/content'

const { locale } = useI18n()

const { data: page } = await useAsyncData(async () => {
  const collection = (`me_${locale.value}`) as keyof Pick<Collections, 'me_en' | 'me_tr'>
  return await queryCollection(collection).first()
}, { watch: [locale] })

// const { data: projects } = await useAsyncData(async () => {
//   const collection = (`projects_${locale.value}`) as keyof Pick<Collections, 'projects_en' | 'projects_tr'>
//   return await queryCollection(collection).first()
// }, { watch: [locale] })
</script>

<template>
  <UPage>
    <UContainer>
      <UPageHero
        :title="page?.title" :description="page?.description"
        :links="[
          { icon: 'mdi:github', color: 'neutral', variant: 'link', to: 'https://github.com/atlaxt', target: '_blank' },
          { icon: 'mdi:linkedin', color: 'neutral', variant: 'link', to: 'https://linkedin.com/in/atlaxt', target: '_blank' },
          { icon: 'mdi:instagram', color: 'neutral', variant: 'link', to: 'https://instagram.com/atlaxt.me', target: '_blank' },
          { label: $t('works_at_trex'), color: 'success', variant: 'link' },
        ]"
      >
        <template #headline>
          <img src="../assets/me.png" class="rounded-full h-24 w-24 mx-auto">
        </template>
      </UPageHero>
    </UContainer>

    <UContainer>
      <UMarquee>
        <UIcon name="simple-icons:nuxt" class="size-10 shrink-0" />
        <UIcon name="mdi:vuejs" class="size-10 shrink-0" />
        <UIcon name="mdi:language-typescript" class="size-10 shrink-0" />
        <UIcon name="mdi:tailwind" class="size-10 shrink-0" />
        <UIcon name="simple-icons:nuxt" class="size-10 shrink-0" />
        <UIcon name="mdi:vuejs" class="size-10 shrink-0" />
        <UIcon name="mdi:language-typescript" class="size-10 shrink-0" />
        <UIcon name="mdi:tailwind" class="size-10 shrink-0" />
      </UMarquee>
    </UContainer>

    <UContainer>
      <UPageSection v-if="page" orientation="horizontal" :title="$t('about_me')">
        <template #description>
          <ContentRenderer :value="page" />
        </template>

        <Logo class="h-48 mx-auto my-auto object-contain" />
      </UPageSection>
    </UContainer>

    <!-- <UContainer>
      <UPageSection v-if="projects" :title="$t('projects')">
        <UPageList>
          <UPageCard
            v-for="(project, index) in (projects?.meta.body as Project[]).splice(0, 3)"
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
      </UPageSection>
    </UContainer> -->
  </UPage>
</template>
