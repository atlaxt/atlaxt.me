<script setup lang="ts">
const { data: value } = await useAsyncData(
  'me',
  () => queryCollection('me').first(),
)

// const { github } = useSocial()
// const ppUrl = `${github.url}.png`
</script>

<template>
  <UPage class="w-full h-full lg:mt-36 mt-24">
    <ContentRenderer
      v-if="value"
      class="mt-12"
      :value="value"
    />
  </UPage>
</template>
