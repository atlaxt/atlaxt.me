<script setup lang="ts">
import Link from '@/components/link.vue'
import MyGithubLink from '@/components/my-github-link.vue'
import { Analytics } from '@vercel/analytics/nuxt'
import { SpeedInsights } from '@vercel/speed-insights/nuxt'

useHead({
  title: 'Atlas Yiğit Aydın',
})
</script>

<template>
  <div class="w-screen justify-center flex h-screen fixed left-0 top-0 bg-black text-white doto">
    <div class="flex flex-col items-start justify-around pt-12 px-6 relative lg:w-96 md:w-10/12 w-full">
      <label> ATLAS YİĞİT AYDIN </label>

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

      <div class="opacity-70 text-yellow-300">
        <label> this page is under construction </label>
      </div>

      <MyGithubLink class="absolute bottom-0 right-0 mx-4 my-2" />
    </div>
  </div>

  <Analytics />
  <SpeedInsights />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Doto&display=swap');

.doto {
  font-family: "Doto", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "ROND" 0;
}
</style>
