<script setup lang="ts">
import Link from '@/components/link.vue'

useHead({
  title: 'Atlas Yiğit Aydın',
})
</script>

<template>
  <div class="w-screen justify-center text-lg flex h-screen fixed left-0 top-0 bg-black text-white doto">
    <div class="flex flex-col justify-around pt-12 px-6">
      <label data-text="ATLAS YİĞİT AYDIN" class="glitch"> ATLAS YİĞİT AYDIN </label>

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
              label: 'QR Fox',
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

<style scoped>
.glitch {
  position: relative;
  font-size: 12p6;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 3px;
  z-index: 1;
}

.glitch:before,
.glitch:after {
  display: block;
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.glitch:before {
  animation: glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  color: #00ffff;
  z-index: -1;
}

.glitch:after {
  animation: glitch-it 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both
    infinite;
  color: #ff00ff;
  z-index: -2;
}

@keyframes glitch-it {
  0% {
    transform: translate(0);
  }
  20% {
    transform: translate(-2px, 2px);
  }
  40% {
    transform: translate(-2px, -2px);
  }
  60% {
    transform: translate(2px, 2px);
  }
  80% {
    transform: translate(2px, -2px);
  }
  to {
    transform: translate(0);
  }
}
</style>
