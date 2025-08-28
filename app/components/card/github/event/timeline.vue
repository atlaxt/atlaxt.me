<script setup lang="ts">
// props
const props = defineProps<{
  events: any[]
}>()

// eventleri günlere göre gruplama
const groups = computed(() => {
  const byDay = new Map<string, any[]>()

  for (const e of props.events ?? []) {
    const d = new Date(e.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

    if (!byDay.has(key))
      byDay.set(key, [])

    byDay.get(key)!.push(e)
  }

  // yeni günler en üste gelsin
  return Array.from(byDay.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
})

// gün formatlama
function fmtDay(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).format(new Date(y, (m - 1), d))
}
</script>

<template>
  <div v-if="!events || events.length === 0" class="rounded-xl border border-dashed p-8 text-center text-zinc-500 dark:text-zinc-400">
    No activity yet.
  </div>

  <ol v-else class="space-y-8">
    <li v-for="[dayKey, items] in groups" :key="dayKey" class="space-y-3">
      <!-- Gün başlığı -->
      <div class="sticky top-0 z-10 -mx-2 px-2 backdrop-blur supports-[backdrop-filter]:bg-white/50 dark:supports-[backdrop-filter]:bg-zinc-900/40">
        <h4 class="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          {{ fmtDay(dayKey) }}
        </h4>
      </div>

      <!-- Timeline spine ve eventler -->
      <div class="relative pl-5">
        <div class="absolute left-1 top-1 bottom-1 w-px bg-zinc-200 dark:bg-zinc-800" />
        <div class="space-y-3">
          <div v-for="e in items" :key="e.id" class="relative">
            <div class="absolute -left-1 top-3 h-2 w-2 rounded-full bg-zinc-400 dark:bg-zinc-600" />
            <CardGithubEventItem :event="e" />
          </div>
        </div>
      </div>
    </li>
  </ol>
</template>
