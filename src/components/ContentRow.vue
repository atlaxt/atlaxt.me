<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
  href?: string // dış link (a tag)
  to?: string // iç link (RouterLink)
  mono?: boolean // başlık font-mono olsun mu
  arrow?: '→' | '↗' // ok karakteri, default →
}>()
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'a'"
    v-bind="to ? { to } : { href, target: '_blank', rel: 'noopener noreferrer' }"
    class="flex items-start justify-between gap-6 py-5 transition-opacity hover:opacity-60"
    style="border-bottom: 1px solid var(--border); color: var(--text);"
  >
    <div>
      <p class="text-sm font-medium mb-1" :class="mono ? 'font-mono' : ''">
        {{ title }}
      </p>
      <p v-if="desc" class="text-xs leading-relaxed" style="color: var(--text-muted);">
        {{ desc }}
      </p>
    </div>
    <span class="text-sm shrink-0 mt-0.5" style="color: var(--text-muted);">{{ arrow ?? '→' }}</span>
  </component>
</template>
