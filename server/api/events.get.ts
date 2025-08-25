let cache: any = null
let lastFetch = 0

export default defineEventHandler(async () => {
  const now = Date.now()
  if (cache && now - lastFetch < 60_000) {
    return cache
  }

  const config = useRuntimeConfig().githubToken

  const url = `https://api.github.com/users/atlaxt/events?per_page=200`
  const data = await $fetch(url, {
    headers: { Authorization: `Bearer ${config}` },
  })

  cache = { success: true, data }
  lastFetch = now
  return cache
})
