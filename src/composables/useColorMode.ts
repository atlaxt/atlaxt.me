import { ref, watch } from 'vue'

// Singleton: tüm bileşenler aynı state'i paylaşır
const isDark = ref(document.documentElement.classList.contains('dark'))
let themeTransitionRunning = false

watch(isDark, (val) => {
  document.documentElement.classList.toggle('dark', val)
  localStorage.setItem('color-mode', val ? 'dark' : 'light')
})

export function useColorMode() {
  function toggle(event?: MouseEvent) {
    if (themeTransitionRunning) {
      return
    }

    const x = event?.clientX ?? window.innerWidth / 2
    const y = event?.clientY ?? window.innerHeight / 2
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // View Transition API desteklenmiyorsa düz geç
    if (!document.startViewTransition || prefersReducedMotion) {
      isDark.value = !isDark.value
      return
    }

    themeTransitionRunning = true
    const transition = document.startViewTransition(() => {
      isDark.value = !isDark.value
    })

    // Tıklanan noktadan dışa doğru dairesel açılma
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    )

    transition.ready
      .then(() => {
        const newLayer = document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${radius * 0.22}px at ${x}px ${y}px)`,
              `circle(${radius * 0.48}px at ${x}px ${y}px)`,
              `circle(${radius * 0.98}px at ${x}px ${y}px)`,
              `circle(${radius * 1.22}px at ${x}px ${y}px)`,
              `circle(${radius * 1.04}px at ${x}px ${y}px)`,
            ],
            filter: [
              'brightness(1.68) saturate(1.44)',
              'brightness(1.3) saturate(1.2)',
              'brightness(1.15) saturate(1.12)',
              'brightness(1.02) saturate(1.02)',
              'brightness(1) saturate(1)',
              'brightness(1) saturate(1)',
            ],
            transform: ['scale(1.065)', 'scale(1.04)', 'scale(1.018)', 'scale(1.006)', 'scale(1)', 'scale(1)'],
            opacity: [0.76, 0.92, 0.98, 1, 1, 1],
            offset: [0, 0.11, 0.24, 0.56, 0.82, 1],
          },
          {
            duration: 560,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
            fill: 'both',
            pseudoElement: '::view-transition-new(root)',
          },
        )

        const oldLayer = document.documentElement.animate(
          {
            opacity: [1, 0.78, 0.42, 0],
            filter: [
              'brightness(1) saturate(1)',
              'brightness(1.1) saturate(1.04)',
              'brightness(1.05) saturate(1.02)',
              'brightness(1.02) saturate(1)',
            ],
            transform: ['scale(1)', 'scale(1.018)', 'scale(1.035)', 'scale(1.045)'],
          },
          {
            duration: 460,
            easing: 'cubic-bezier(0.2, 0.02, 0.18, 1)',
            fill: 'both',
            pseudoElement: '::view-transition-old(root)',
          },
        )

        // Etkileşimi animasyon bitimini bekletmeden geri ac.
        setTimeout(() => {
          themeTransitionRunning = false
        }, 140)

        return Promise.all([newLayer.finished, oldLayer.finished])
      })
      .catch(() => {
        themeTransitionRunning = false
      })
      .finally(() => {
        if (themeTransitionRunning) {
          themeTransitionRunning = false
        }
      })
  }

  return { isDark, toggle }
}
