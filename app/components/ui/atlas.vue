<script setup lang="ts">
import { reactive } from 'vue'

const parallax = reactive({ x: 0, y: 0 })

function handleMouseMove(e: MouseEvent) {
  parallax.x = (e.clientX - window.innerWidth / 5)
  parallax.y = (e.clientY - window.innerHeight / 5)
}
</script>

<template>
  <div
    class="relative h-screen overflow-x-hidden w-screen flex justify-center my_font select-none"
    @mousemove="handleMouseMove"
  >
    <img class="absolute h-screen w-full z-0" src="../../assets/bg.jpg">

    <span
      class="animate-cinematic lg:mt-24 md:mt-28 mt-32 absolute z-10 text-white text-[25vw] font-extralight tracking-widest leading-none select-none transition-transform duration-75 ease-out"
      :style="{ transform: `translate(${parallax.x * 0.02}px, ${parallax.y * 0.02}px) scale(1)` }"
    >
      ATLAS
    </span>

    <img class="absolute h-screen min-w-10/12 object-cover z-20" src="../../assets/me.png">

    <span
      class="animate-cinematic lg:mt-24 md:mt-28 mt-32 absolute z-30 text-white text-[25vw] font-extralight tracking-widest leading-none select-none pointer-events-none transition-transform duration-75 ease-out"
      :style="{ transform: `translate(${parallax.x * 0.02}px, ${parallax.y * 0.02}px) scale(1)` }"
    >
      <span class="text-transparent">ATL</span>AS
    </span>

    <div class="absolute bottom-2 lg:z-10 md:z-10 z-20 opacity-60 animate-cinematic">
      <BitsScrollVelocity
        :texts="['Web Developer •']"
        :velocity="40"
        :damping="50"
        :stiffness="400"
        :velocity-mapping="{ input: [0, 1000], output: [0, 5] }"
        class-name="custom-scroll-text md:text-4xl text-xl"
        parallax-class-name="custom-parallax"
        scroller-class-name="custom-scroller"
      />
    </div>
  </div>
</template>

<style scoped>
.my_font {
  font-family: "Bellota Text", sans-serif;
  font-smooth: always;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

.animate-cinematic {
  animation: cinematicReveal 3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes cinematicReveal {
  0% {
    opacity: 0;
    filter: blur(20px);
    /* Scale inline style ile yönetildiği için buradan kaldırdık */
  }

  100% {
    opacity: 0.7;
    filter: blur(0);
  }
}
</style>
