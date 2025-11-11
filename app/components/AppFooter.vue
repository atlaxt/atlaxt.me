<script setup lang="ts">
const {
  github,
  bluesky,
  instagram,
  linkedIn,
  npm,
  x,
  email,
} = useSocial()
</script>

<template>
  <UFooter
    class="z-10 bg-transparent mt-12"
    :ui="{ left: 'text-muted text-xs' }"
  >
    <template #left>
      <UButton v-bind="email" variant="link" color="neutral" size="xs" />
    </template>

    <template #right>
      <template v-if="[github, bluesky, instagram, linkedIn, npm, x].some(link => link)">
        <UButton
          v-for="(link, index) of [github, bluesky, instagram, linkedIn, npm, x]"
          :key="index"
          v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>
  </UFooter>
</template>
