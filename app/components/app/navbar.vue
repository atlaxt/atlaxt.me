<script setup lang="ts">
const isOpen = ref(false)
const mounted = ref(false)

const items = [
  {
    label: 'ME',
    to: '/',
    gridClass: 'md:col-span-2 md:row-span-2',
    textSize: 'md:text-7xl lg:text-8xl',
  },
  {
    label: 'Projects',
    to: '/projects',
    gridClass: 'md:col-span-2 md:row-span-2 md:col-start-3',
    textSize: 'md:text-7xl lg:text-8xl',
  },

  {
    label: 'Contact',
    to: '/contact',
    gridClass: 'md:col-span-2 md:row-span-2 md:row-start-3',
    textSize: 'md:text-7xl lg:text-8xl',
  },

  {
    label: 'References',
    to: '/references',
    gridClass: 'md:col-start-3 md:row-start-3',
    textSize: 'md:text-3xl lg:text-4xl',
  },
  {
    label: 'CV',
    to: '/cv',
    gridClass: 'md:col-start-4 md:row-start-3',
    textSize: 'md:text-3xl lg:text-4xl',
  },
  {
    label: 'Photos',
    to: '/photos',
    gridClass: 'md:col-start-3 md:row-start-4',
    textSize: 'md:text-3xl lg:text-4xl',
  },
  {
    label: 'Books',
    to: '/books',
    gridClass: 'md:col-start-4 md:row-start-4',
    textSize: 'md:text-3xl lg:text-4xl',
  },
]

onMounted(() => {
  mounted.value = true
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape')
    isOpen.value = false
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div v-if="mounted">
    <div class="fixed top-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 hover:scale-105 ">
      <BitsGlassSurface
        :width="200"
        :height="30"
        :border-radius="36"
        :border-width="1"
        class-name="cursor-pointer flex items-center justify-center overflow-hidden relative"
        @click="toggleMenu"
      >
        <div class="left-0 top-0 absolute w-full -z-10 h-full bg-black/30" />
        <div
          class="h-1 rounded-full transition-all duration-500 ease-out"
          :class="isOpen ? 'w-24 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.6)] h-2' : 'w-12 bg-white/80'"
        />
      </BitsGlassSurface>
    </div>

    <!-- <div
      class="fixed inset-0 z-40 w-full h-full transition-all duration-700 cubic-bezier(0.76, 0, 0.24, 1) "
      :class="isOpen ? 'pointer-events-auto bg-black/30' : 'pointer-events-none'"
    >
      <div class="w-full h-full flex flex-col pt-24 pb-8 px-4 md:px-8">
        <div class="w-full h-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4">
          <BitsGlassSurface
            v-for="(item, index) in items"
            :key="index"
            width="100%"
            height="100%"
            :border-radius="24"
            :class-name="`relative overflow-hidden group min-h-[100px] md:min-h-0 transform-gpu transition-all duration-700 ease-out will-change-transform will-change-[opacity] ${item.gridClass} ${
              isOpen
                ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none'
            }`"
            :style="{
              transitionDelay: isOpen
                ? `${index * 50 + 200}ms`
                : `${(items.length - 1 - index) * 30}ms`,
            }"
          >
            <NuxtLink
              :to="item.to"
              class="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white transition-colors duration-300 bg-black/50 hover:bg-black/70"
              @click="isOpen = false"
            >
              <div class="absolute top-6 right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                <Icon name="lucide:arrow-right" class="text-3xl text-white" />
              </div>

              <span
                class="font-bold tracking-tighter uppercase transform group-hover:translate-x-2 transition-transform duration-300 origin-left will-change-transform"
                :class="`text-4xl ${item.textSize}`"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </BitsGlassSurface>
        </div>
      </div>
    </div> -->

    <div
      class="fixed inset-0 z-40 w-full h-full transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)]"
      :class="isOpen ? 'opacity-100 pointer-events-auto backdrop-blur-sm bg-black/40' : 'opacity-0 pointer-events-none backdrop-blur-none delay-200'"
    >
      <div class="w-full h-full flex flex-col pt-24 pb-8 px-4 md:px-8">
        <div class="w-full h-full grid grid-cols-1 md:grid-cols-4 md:grid-rows-4 gap-4">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="relative overflow-hidden group rounded-3xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-700 ease-out will-change-transform"
            :class="`
              ${item.gridClass}
              ${isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'}
            `"
            :style="{
              transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
            }"
          >
            <NuxtLink
              :to="item.to"
              class="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white"
              @click="isOpen = false"
            >
              <div class="absolute top-6 right-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
                <Icon name="lucide:arrow-right" class="text-3xl text-white" />
              </div>

              <span
                class="font-bold tracking-tighter uppercase transform group-hover:translate-x-2 transition-transform duration-300 origin-left"
                :class="`text-4xl ${item.textSize}`"
              >
                {{ item.label }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
