<script setup lang="ts">
import type { ToolEntry } from '@/types'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReadmeCache } from '@/composables/useReadmeCache'
import toolsRaw from '../../content/tools.yaml'

const tools = toolsRaw as unknown as ToolEntry[]

const route = useRoute()
const { preloadAll } = useReadmeCache()

onMounted(() => {
  preloadAll(tools.map(t => t.package))
})
// const router = useRouter()

// function goToTool(id: string) {
//   router.push(`/cli/tools/${id}`)
// }
</script>

<template>
  <div class="flex min-h-[calc(100vh-57px)]">
    <!-- Sidebar -->
    <aside class="hidden md:flex flex-col w-52 shrink-0 px-2 md:px-0 py-16" style="border-right: 1px solid var(--border);">
      <nav class="flex flex-col gap-1">
        <!-- Giriş -->
        <RouterLink
          to="/cli"
          class="text-sm py-1 transition-opacity hover:opacity-100"
          :style="route.path === '/cli' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
        >
          Giriş
        </RouterLink>

        <!-- Templates -->
        <RouterLink
          to="/cli/templates"
          class="text-sm py-1 transition-opacity hover:opacity-100"
          :style="route.path === '/cli/templates' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
        >
          Templates
        </RouterLink>

        <!-- Tools + liste -->
        <div>
          <RouterLink
            to="/cli/tools"
            class="text-sm py-1 transition-opacity hover:opacity-100"
            :style="route.path === '/cli/tools' ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
          >
            Tools
          </RouterLink>

          <div class="flex flex-col mt-1 ml-3">
            <RouterLink
              v-for="tool in tools"
              :key="tool.id"
              :to="`/cli/tools/${tool.id}`"
              class="text-xs py-1 text-left transition-opacity hover:opacity-100"
              :style="route.path === `/cli/tools/${tool.id}` ? 'color: var(--text);' : 'color: var(--text-muted); opacity: 0.6;'"
            >
              {{ tool.package.split('/')[1] }}
            </RouterLink>
          </div>
        </div>
      </nav>
    </aside>

    <!-- İçerik -->
    <main class="flex-1 px-10 py-16 w-full">
      <slot />
    </main>
  </div>
</template>
