<script setup lang="ts">
import { computed, ref } from 'vue'

const props = defineProps<{
  npm: string
  pnpm: string
  label?: string
}>()

type PM = 'npm' | 'pnpm'
const pm = ref<PM>('npm')
const copied = ref(false)
const current = computed(() => pm.value === 'npm' ? props.npm : props.pnpm)

function copy() {
  navigator.clipboard.writeText(current.value.trim()).then(() => {
    copied.value = true
    setTimeout(() => copied.value = false, 1500)
  })
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-2">
      <p v-if="label" class="label-micro" style="color: var(--text-muted); opacity: 0.5;">
        {{ label }}
      </p>
      <span v-else />
      <div class="flex items-center" style="border: 1px solid var(--border);">
        <button
          class="text-xs px-2.5 py-1 transition-opacity"
          :style="pm === 'npm' ? 'background: var(--text); color: var(--bg);' : 'color: var(--text-muted); opacity: 0.5;'"
          @click="pm = 'npm'"
        >
          npm
        </button>
        <button
          class="text-xs px-2.5 py-1 transition-opacity"
          :style="pm === 'pnpm' ? 'background: var(--text); color: var(--bg);' : 'color: var(--text-muted); opacity: 0.5;'"
          @click="pm = 'pnpm'"
        >
          pnpm
        </button>
      </div>
    </div>

    <div class="flex items-center" style="background: var(--bg-subtle);">
      <code class="text-sm font-mono flex-1 px-4 py-2.5 truncate" style="color: var(--text);">{{ current }}</code>
      <button
        class="flex items-center justify-center px-3 py-2.5 shrink-0 transition-opacity hover:opacity-60"
        style="color: var(--text-muted);"
        :title="copied ? 'Kopyalandı' : 'Kopyala'"
        @click="copy"
      >
        <!-- Kopyalandı: check -->
        <svg v-if="copied" xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <!-- Kopyala: clipboard -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
        </svg>
      </button>
    </div>
  </div>
</template>
