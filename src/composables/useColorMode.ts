import { ref, watch } from 'vue'

// Singleton: tüm bileşenler aynı state'i paylaşır
const isDark = ref(document.documentElement.classList.contains('dark'))

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('color-mode', val ? 'dark' : 'light')
})

export function useColorMode() {
  function toggle(event?: MouseEvent) {
    const x = event?.clientX ?? window.innerWidth  / 2
    const y = event?.clientY ?? window.innerHeight / 2

    // View Transition API desteklenmiyorsa düz geç
    if (!document.startViewTransition) {
      isDark.value = !isDark.value
      return
    }

    const transition = document.startViewTransition(() => {
      isDark.value = !isDark.value
    })

    // Tıklanan noktadan dışa doğru dairesel açılma
    const radius = Math.hypot(
      Math.max(x, window.innerWidth  - x),
      Math.max(y, window.innerHeight - y),
    )

    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 380, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return { isDark, toggle }
}
