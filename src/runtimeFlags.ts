const flags = new Set<string>()

/**
 * Returns true only the first time a key is seen in this page load.
 * (Resets on full reload; persists across SPA navigations.)
 */
export function oncePerLoad(key: string) {
  if (flags.has(key))
    return false
  flags.add(key)
  return true
}
