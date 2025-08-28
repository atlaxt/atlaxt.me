<script setup lang="ts">
import signBlack from '~/assets/sign/sign_black.png'
import signWhite from '~/assets/sign/sign_white.png'

const mounted = ref<boolean>(false)

onMounted(() => {
  mounted.value = true
})
</script>

<template>
  <header v-if="mounted" class="flex justify-between items-center w-full h-24 py-4 md:px-12 px-2">
    <RouterLink :to="{ name: 'home' }" class="h-full" aria-label="Go to homepage">
      <img
        :src="isDark ? signWhite : signBlack"
        class="h-16 object-cover select-none"
        :alt="isDark ? 'White logo' : 'Black logo'"
      >
    </RouterLink>

    <nav class="flex flex-row items-center md:gap-8 gap-6 select-none" aria-label="Main navigation">
      <div class="flex flex-row md:gap-8 gap-6 items-center">
        <LinkRoute
          v-for="link in [
            { to: 'home', label: 'Home', icon: 'heroicons:home' },
            { to: 'projects', label: 'Projects', icon: 'lucide:folder-code' },
            // { to: 'photos', label: 'Photos', icon: 'lucide:camera' },
            { to: 'books', label: 'Books', icon: 'lucide:book' },
            { to: 'events', label: 'Events', icon: 'lucide:clock' },
          ]" :key="link.to" v-bind="link"
        />
      </div>

      <div class="md:flex flex-row gap-4 hidden">
        <LinkSocial
          v-for="social in useSocialLinks()"
          :key="social.name"
          :name="social.name"
          :url="social.url"
          :icon="social.icon"
        />
      </div>
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
