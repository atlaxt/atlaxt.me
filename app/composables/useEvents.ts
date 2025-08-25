export function useEvents() {
  const events = ref<GitHubEvent[]>([])
  const loading = ref(false)

  const fetchEvents = async () => {
    loading.value = true
    try {
      const data = await $fetch<{ success: boolean, data: GitHubEvent[] }>('/api/events')
      if (data.success) {
        events.value = data.data
      }
    }
    finally {
      loading.value = false
    }
  }

  return {
    events,
    loading,
    fetchEvents,
  }
}
