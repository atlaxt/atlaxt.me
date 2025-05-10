export const isDark = computed(() => useColorMode().value === 'dark')

export function toggleTheme() {
  useColorMode().preference = isDark.value ? 'light' : 'dark'
}
