<script setup lang="ts">
</script>

<template>
  <div class="fixed left-0 top-0 w-screen h-screen overflow-y-auto overflow-x-hidden bg-zinc-900 text-white">
    <div class="fixed w-screen flex justify-center z-99 pt-3">
      <AppNavbar />
    </div>
    <div class="flex flex-col">
      <slot />
    </div>
  </div>
</template>
