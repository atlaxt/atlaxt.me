<script setup lang="ts">
const props = defineProps<{ event: GitHubEvent }>()

const repoWebUrl = computed(() => {
  const api = props.event.repo.url
  const parts = api.split('/repos/')
  return parts.length === 2 ? `https://github.com/${parts[1]}` : `https://github.com/${props.event.repo.name}`
})

function formatAbsolute(dtIso: string) {
  const dt = new Date(dtIso)
  return new Intl.DateTimeFormat(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dt)
}
function formatRelative(dtIso: string) {
  const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })
  const now = Date.now()
  const diffMs = new Date(dtIso).getTime() - now
  const mins = Math.round(diffMs / 60000)
  const hours = Math.round(diffMs / 3600000)
  const days = Math.round(diffMs / 86400000)
  if (Math.abs(mins) < 60)
    return rtf.format(mins, 'minute')
  if (Math.abs(hours) < 24)
    return rtf.format(hours, 'hour')
  return rtf.format(days, 'day')
}

interface ViewModel {
  icon: 'star' | 'plus' | 'branch' | 'issue'
  tint: 'amber' | 'emerald' | 'sky' | 'violet'
  title: string
  subtitle?: string
  primaryHref?: string
  secondaryHref?: string
  secondaryText?: string
}
const vm = computed<ViewModel | false>(() => {
  const e = props.event
  const repoUrl = repoWebUrl.value

  if (e.type === 'WatchEvent') {
    return {
      icon: 'star',
      tint: 'amber',
      title: `Starred ${e.repo.name}`,
      subtitle: 'Marked as favorite',
      primaryHref: repoUrl,
    }
  }

  if (e.type === 'CreateEvent') {
    if (e.payload.ref_type === 'repository') {
      return {
        icon: 'plus',
        tint: 'emerald',
        title: `Created repository ${e.repo.name}`,
        primaryHref: repoUrl,
      }
    }
    if (e.payload.ref_type === 'branch') {
      return {
        icon: 'branch',
        tint: 'sky',
        title: `Created branch ${e.payload.ref ?? ''}`,
        subtitle: e.repo.name,
        primaryHref: `${repoUrl}/tree/${e.payload.ref ?? ''}`,
        secondaryHref: repoUrl,
        secondaryText: 'Open repo',
      }
    }
    return {
      icon: 'plus',
      tint: 'emerald',
      title: `Created ${e.payload.ref_type} ${e.payload.ref ?? ''}`,
      subtitle: e.repo.name,
      primaryHref: repoUrl,
    }
  }

  if (e.type === 'IssuesEvent') {
    const issue = e.payload.issue
    const verb
      = e.payload.action === 'opened'
        ? 'Opened'
        : e.payload.action === 'closed' ? 'Closed' : 'Reopened'
    return {
      icon: 'issue',
      tint: 'violet',
      title: `${verb} issue #${issue.number}: ${issue.title}`,
      subtitle: e.repo.name,
      primaryHref: issue.html_url,
      secondaryHref: repoUrl,
      secondaryText: 'Open repo',
    }
  }

  return false
})

const Icon = defineComponent<{ name: ViewModel['icon'] }>({
  props: { name: { type: String as () => ViewModel['icon'], required: true } },

  setup(p) {
    return () => {
      if (p.name === 'star') {
        return h(
          'svg',
          { viewBox: '0 0 24 24', class: 'h-5 w-5' },
          [
            h('path', {
              fill: 'currentColor',
              d: 'M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
            }),
          ],
        )
      }

      if (p.name === 'plus') {
        return h(
          'svg',
          { viewBox: '0 0 24 24', class: 'h-5 w-5' },
          [
            h('path', {
              fill: 'currentColor',
              d: 'M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z',
            }),
          ],
        )
      }

      if (p.name === 'branch') {
        return h(
          'svg',
          { viewBox: '0 0 24 24', class: 'h-5 w-5' },
          [
            h('path', {
              fill: 'currentColor',
              d: 'M6 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0 8a3 3 0 1 0 0 6c.8 0 1.53-.32 2.06-.84A5 5 0 0 0 13 11h2a3 3 0 1 0 0-2h-2a7 7 0 0 1-6 3Z',
            }),
          ],
        )
      }

      // issue
      return h(
        'svg',
        { viewBox: '0 0 24 24', class: 'h-5 w-5' },
        [
          h('path', {
            fill: 'currentColor',
            d: 'M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z',
          }),
        ],
      )
    }
  },

})

const tintMap: Record<ViewModel['tint'], { ring: string, bg: string, text: string }> = {
  amber: { ring: 'ring-amber-300/40', bg: 'bg-amber-50 dark:bg-amber-900/10', text: 'text-amber-600 dark:text-amber-300' },
  emerald: { ring: 'ring-emerald-300/40', bg: 'bg-emerald-50 dark:bg-emerald-900/10', text: 'text-emerald-600 dark:text-emerald-300' },
  sky: { ring: 'ring-sky-300/40', bg: 'bg-sky-50 dark:bg-sky-900/10', text: 'text-sky-600 dark:text-sky-300' },
  violet: { ring: 'ring-violet-300/40', bg: 'bg-violet-50 dark:bg-violet-900/10', text: 'text-violet-600 dark:text-violet-300' },
}
</script>

<template>
  <article
    v-if="vm"
    class="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 md:p-5 hover:shadow-sm transition-shadow"
    :class="[tintMap[vm.tint].bg]"
  >
    <div class="flex items-start gap-3">
      <div
        class="mt-0.5 grid h-9 w-9 place-items-center rounded-xl ring-2"
        :class="[tintMap[vm.tint].ring, tintMap[vm.tint].bg]"
        aria-hidden="true"
      >
        <Icon :name="vm.icon" :class="tintMap[vm.tint].text" />
      </div>

      <div class="min-w-0 flex-1">
        <h3 class="text-sm md:text-base font-semibold text-zinc-900 dark:text-zinc-100">
          <a v-if="vm.primaryHref" :href="vm.primaryHref" target="_blank" rel="noreferrer" class="hover:underline">
            {{ vm.title }}
          </a>
          <template v-else>
            {{ vm.title }}
          </template>
        </h3>

        <p v-if="vm.subtitle" class="mt-0.5 text-xs md:text-sm text-zinc-600 dark:text-zinc-400">
          {{ vm.subtitle }}
        </p>

        <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <!-- actor -->
          <a :href="`https://github.com/${event.actor.login}`" target="_blank" rel="noreferrer" class="inline-flex items-center gap-2 hover:underline">
            <img :src="event.actor.avatar_url" alt="" class="h-4 w-4 rounded-full">
            <span>@{{ event.actor.login }}</span>
          </a>

          <span aria-hidden="true">•</span>

          <!-- repo -->
          <a :href="`https://github.com/${event.repo.name}`" target="_blank" rel="noreferrer" class="hover:underline">
            {{ event.repo.name }}
          </a>

          <span aria-hidden="true">•</span>

          <!-- time -->
          <span :title="formatAbsolute(event.created_at)">{{ formatRelative(event.created_at) }}</span>

          <template v-if="vm.secondaryHref">
            <span aria-hidden="true">•</span>
            <a :href="vm.secondaryHref" target="_blank" rel="noreferrer" class="hover:underline">
              {{ vm.secondaryText ?? 'Details' }}
            </a>
          </template>
        </div>
      </div>
    </div>
  </article>
</template>
