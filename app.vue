<script setup lang="ts">
import Link from '@/components/link.vue'

const colorMode = useColorMode()

onMounted(() => {
  colorMode.preference = 'light'
})
</script>

<template>
  <div class="w-screen justify-center text-lg flex h-screen fixed left-0 top-0 bg-zinc-900 text-white doto">
    <div class="flex flex-col justify-around pt-12 px-6">
      <label> ATLAS YİĞİT AYDIN </label>

      <div class="flex flex-col gap-4">
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
                live: 'https://stars.atlasyigitaydin.com/',
                github: 'https://github.com/atlasyigitaydin/qr',
              },
            },
            {
              label: 'FOXIAN',
              links: {
                live: 'https://stars.atlasyigitaydin.com/',
                github: 'https://github.com/atlasyigitaydin/foxian',
              },
            },
          ]"
          :key
          :label="link.label"
          :links="link.links"
        />
      </div>

      <div class="opacity-70">
        <label> this page is under construction </label>
      </div>
    </div>
  </div>
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
