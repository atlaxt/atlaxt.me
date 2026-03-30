import { ref } from 'vue'
import { fetchNpmReadme } from './useNpm'

const cache = ref<Record<string, string | null>>({})
const loading = ref<Record<string, boolean>>({})
let preloaded = false

export function useReadmeCache() {
  async function preloadAll(packages: string[]) {
    if (preloaded)
      return
    preloaded = true

    await Promise.all(
      packages.map(async (pkg) => {
        if (pkg in cache.value)
          return
        loading.value[pkg] = true
        const result = await fetchNpmReadme(pkg)
        cache.value[pkg] = result
        loading.value[pkg] = false
      }),
    )
  }

  async function getReadme(pkg: string): Promise<string | null> {
    if (pkg in cache.value)
      return cache.value[pkg] ?? ''
    loading.value[pkg] = true
    const result = await fetchNpmReadme(pkg)
    cache.value[pkg] = result
    loading.value[pkg] = false
    return result
  }

  function isReady(pkg: string): boolean {
    return pkg in cache.value && !loading.value[pkg]
  }

  return { cache, loading, preloadAll, getReadme, isReady }
}
