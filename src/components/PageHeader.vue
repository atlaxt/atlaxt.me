<script setup lang="ts">
interface Crumb {
  label: string
  to?: string
}

defineProps<{
  crumbs: Crumb[]
}>()
</script>

<template>
  <nav class="label-micro flex items-center gap-2 mb-12" aria-label="breadcrumb">
    <RouterLink
      to="/"
      class="transition-opacity hover:opacity-80"
      style="color: var(--text-muted); opacity: 0.4;"
      aria-label="Ana Sayfa"
    >
      ←
    </RouterLink>

    <template v-for="(crumb, i) in crumbs" :key="i">
      <span style="color: var(--border);">/</span>

      <RouterLink
        v-if="crumb.to && i < crumbs.length - 1"
        :to="crumb.to"
        class="transition-opacity hover:opacity-80"
        style="color: var(--text-muted); opacity: 0.5;"
      >
        {{ crumb.label }}
      </RouterLink>

      <span
        v-else
        class="truncate"
        style="color: var(--text-muted); opacity: 0.5; max-width: 40ch;"
      >
        {{ crumb.label }}
      </span>
    </template>
  </nav>
</template>
