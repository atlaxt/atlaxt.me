<script setup lang="ts">
import { SpeedInsights } from '@vercel/speed-insights/nuxt'
</script>

<template>
  <div class="fixed top-0 left-0 w-screen h-screen flex flex-col barlow bg-black text-white doto">
    <div class="w-full h-full flex justify-center">
      <slot />
    </div>
    <SpeedInsights />
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
