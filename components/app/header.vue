<script setup lang="ts">
import signBlack from '~/assets/sign/sign_black.png'
import signWhite from '~/assets/sign/sign_white.png'

const mounted = ref<boolean>(false)
const route = useRoute()
const currentRouteName = computed(() => route.name)

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <header v-if="mounted" class="flex justify-between items-center w-full h-24 py-4 lg:px-12 px-2">
    <RouterLink :to="{ name: 'home' }" class="h-full" aria-label="Go to homepage">
      <img
        :src="isDark ? signWhite : signBlack"
        class="h-full"
        :alt="isDark ? 'White logo' : 'Black logo'"
      >
    </RouterLink>

    <nav class="flex flex-row lg:gap-8 gap-4 items-center" aria-label="Main navigation">
      <RouterLink
        class="opacity-70 hover:opacity-100 flex flex-row items-center gap-2 duration-300"
        :class="{
          'opacity-100': currentRouteName === 'projects',
        }"
        :to="{ name: 'projects' }"
        aria-label="View projects"
      >
        <Icon class="text-xl" name="lucide:folder-code" aria-hidden="true" />
        <span class="hidden md:inline"> Projects </span>
      </RouterLink>

      <RouterLink
        class="opacity-70 hover:opacity-100 duration-300 flex items-center gap-2"
        :class="{
          'opacity-100': currentRouteName === 'photos',
        }"
        :to="{ name: 'photos' }"
        aria-label="View photos"
      >
        <Icon class="text-xl" name="lucide:camera" aria-hidden="true" />
        <span class="hidden md:inline"> Photos </span>
      </RouterLink>

      <a
        class="opacity-70 hover:opacity-100 duration-300 flex items-center"
        target="_blank"
        href="https://github.com/atlaxt"
        rel="noopener noreferrer"
        aria-label="Visit GitHub profile"
      >
        <Icon class="text-xl" name="lucide:github" aria-hidden="true" />
      </a>

      <a
        class="opacity-70 hover:opacity-100 duration-300 flex items-center"
        target="_blank"
        href="https://linkedin.com/in/atlaxt"
        rel="noopener noreferrer"
        aria-label="Visit GitHub profile"
      >
        <Icon class="text-xl" name="lucide:linkedin" aria-hidden="true" />
      </a>

      <button
        class="cursor-pointer opacity-70 hover:opacity-100 duration-300 flex items-center"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @click="toggleTheme"
      >
        <Icon
          class="text-xl"
          :name="`${isDark ? 'lucide:moon' : 'lucide:sun'}`"
          aria-hidden="true"
        />
      </button>
    </nav>
  </header>
  <div v-else class="h-24" aria-hidden="true" />
</template>
