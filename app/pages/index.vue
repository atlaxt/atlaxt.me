<script setup lang="ts">
const { data: value } = await useAsyncData(
  'me',
  () => queryCollection('me').first(),
)

const { github } = useSocial()
const ppUrl = `${github.url}.png`
</script>

<template>
  <UPage class="w-full h-full mt-36">
    <div class="w-full flex justify-center">
      <img class="h-24 rounded-full" :src="ppUrl">
    </div>
    <ContentRenderer
      v-if="value"
      class="mt-12"
      :value="value"
    />
  </UPage>
</template>
