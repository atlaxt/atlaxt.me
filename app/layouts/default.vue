<script setup lang="ts">
</script>

<template>
  <UMain>
    <UContainer class="min-h-screen bg-default border-x border-default px-0 sm:px-0 lg:px-0">
      <StarsBg class="fixed" />
      <AppHeader />
      <slot />
    </UContainer>
  </UMain>
</template>
