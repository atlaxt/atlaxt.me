<script setup lang="ts">
import Link from '@/components/link.vue'

useHead({
  title: 'Atlas Yiğit Aydın',
})
</script>

<template>
  <div class="w-screen justify-center text-lg flex h-screen fixed left-0 top-0 bg-black text-white doto">
    <div class="flex flex-col justify-around pt-12 px-6">
      <label data-glitch="ATLAS YİĞİT AYDIN" class="glitch"> ATLAS YİĞİT AYDIN </label>

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
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  color: #fff;
  letter-spacing: 5px;
  z-index: 1;
  animation: shift 1s ease-in-out infinite alternate;
}

.glitch:before,
.glitch:after {
  display: block;
  content: attr(data-glitch);
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.8;
}

.glitch:before {
  animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite;
  color: #8b00ff;
  z-index: -1;
}

.glitch:after {
  animation: glitch 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse both infinite;
  color: #00e571;
  z-index: -2;
}

@keyframes glitch {
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

@keyframes shift {
  0%, 40%, 44%, 58%, 61%, 65%, 69%, 73%, 100% {
    transform: skewX(0deg);
  }

  41% {
    transform: skewX(10deg);
  }

  42% {
    transform: skewX(-10deg);
  }

  59% {
    transform: skewX(40deg) skewY(10deg);
  }

  60% {
    transform: skewX(-40deg) skewY(-10deg);
  }

  63% {
    transform: skewX(10deg) skewY(-5deg);
  }

  70% {
    transform: skewX(-50deg) skewY(-20deg);
  }

  71% {
    transform: skewX(10deg) skewY(-10deg);
  }
}
</style>
