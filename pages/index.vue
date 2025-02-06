<script setup lang="ts">
import Link from '@/components/link.vue'

definePageMeta({
  name: 'home',
})
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col">
      <p> ATLAS YİĞİT AYDIN </p>
      <p class="text-xs">
        FRONTEND DEVELOPER
      </p>
    </div>

    <div class="flex flex-col gap-4 w-full">
      <Link
        v-for="(link, key) in [
          {
            label: 'STARS',
            links: {
              live: 'https://stars.atlasyigitaydin.com/',
              github: 'https://github.com/atlasyigitaydin/stars',
            },
          },
          {
            label: 'QR',
            links: {
              live: 'https://qr.atlasyigitaydin.com/',
              github: 'https://github.com/atlasyigitaydin/qr',
            },
          },
          {
            label: 'FOXIAN',
            info: 'not responsive',
            links: {
              live: 'https://foxian.atlasyigitaydin.com/',
              github: 'https://github.com/atlasyigitaydin/foxian',
            },
          },
        ]"
        :key
        :label="link.label"
        :links="link.links"
        :info="link.info"
      />
    </div>

    <!-- <div class="opacity-70 text-yellow-300">
      <label> this page is under construction </label>
    </div> -->

    <MyGithubLink class="w-full flex justify-center" />
  </NuxtLayout>
</template>
