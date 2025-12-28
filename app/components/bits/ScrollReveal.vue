<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { computed, onMounted, onUnmounted, useTemplateRef, watch } from 'vue'

const props = withDefaults(defineProps<Props>(), {
  enableBlur: true,
  baseOpacity: 0.1,
  baseRotation: 3,
  blurStrength: 4,
  containerClassName: '',
  textClassName: '',
  rotationEnd: 'bottom bottom',
  wordAnimationEnd: 'bottom bottom',
})

gsap.registerPlugin(ScrollTrigger)

interface Props {
  children: string
  scrollContainerRef?: { current: HTMLElement | null }
  enableBlur?: boolean
  baseOpacity?: number
  baseRotation?: number
  blurStrength?: number
  containerClassName?: string
  textClassName?: string
  rotationEnd?: string
  wordAnimationEnd?: string
}

const containerRef = useTemplateRef<HTMLElement>('containerRef')
let scrollTriggerInstances: ScrollTrigger[] = []

const splitText = computed(() => {
  const text = typeof props.children === 'string' ? props.children : ''
  return text.split(/(\s+)/).map((word, index) => ({
    text: word,
    isWhitespace: word.match(/^\s+$/) !== null,
    key: index,
  }))
})

function initializeAnimation() {
  const el = containerRef.value
  if (!el)
    return

  scrollTriggerInstances.forEach(trigger => trigger.kill())
  scrollTriggerInstances = []

  const scroller
    = props.scrollContainerRef && props.scrollContainerRef.current ? props.scrollContainerRef.current : window

  const rotationTl = gsap.fromTo(
    el,
    { transformOrigin: '0% 50%', rotate: props.baseRotation },
    {
      ease: 'none',
      rotate: 0,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom',
        end: props.rotationEnd,
        scrub: true,
      },
    },
  )

  if (rotationTl.scrollTrigger) {
    scrollTriggerInstances.push(rotationTl.scrollTrigger)
  }

  const wordElements = el.querySelectorAll('.word')

  const opacityTl = gsap.fromTo(
    wordElements,
    { opacity: props.baseOpacity, willChange: 'opacity' },
    {
      ease: 'none',
      opacity: 1,
      stagger: 0.05,
      scrollTrigger: {
        trigger: el,
        scroller,
        start: 'top bottom-=20%',
        end: props.wordAnimationEnd,
        scrub: true,
      },
    },
  )

  if (opacityTl.scrollTrigger) {
    scrollTriggerInstances.push(opacityTl.scrollTrigger)
  }

  if (props.enableBlur) {
    const blurTl = gsap.fromTo(
      wordElements,
      { filter: `blur(${props.blurStrength}px)` },
      {
        ease: 'none',
        filter: 'blur(0px)',
        stagger: 0.05,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top bottom-=20%',
          end: props.wordAnimationEnd,
          scrub: true,
        },
      },
    )

    if (blurTl.scrollTrigger) {
      scrollTriggerInstances.push(blurTl.scrollTrigger)
    }
  }
}

onMounted(() => {
  initializeAnimation()
})

onUnmounted(() => {
  scrollTriggerInstances.forEach(trigger => trigger.kill())
})

watch(
  [
    () => props.children,
    () => props.scrollContainerRef,
    () => props.enableBlur,
    () => props.baseRotation,
    () => props.baseOpacity,
    () => props.rotationEnd,
    () => props.wordAnimationEnd,
    () => props.blurStrength,
  ],
  () => {
    initializeAnimation()
  },
  { deep: true },
)
</script>

<template>
  <h2 ref="containerRef" :class="`my-5 ${containerClassName}`">
    <p :class="`leading-relaxed font-semibold ${textClassName}`" style="font-size: clamp(1.6rem, 4vw, 3rem)">
      <span v-for="(word, index) in splitText" :key="index" :class="word.isWhitespace ? '' : 'inline-block word'">
        {{ word.text }}
      </span>
    </p>
  </h2>
</template>
