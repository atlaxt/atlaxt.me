<script setup lang="ts">
definePageMeta({
  name: 'home',
  path: '/',
})

const { data: value } = await useAsyncData(
  'content/me',
  () => queryCollection('me').first(),
)

const socialLinks = useSocialLinks()
const email = useEmail()
</script>

<template>
  <main class="lg:w-3xl lg:px-0 px-2 mx-auto mt-12">
    <ContentRenderer
      :value="value"
      class="space-y-8 content-wrapper"
    />

    <div class="flex flex-col gap-2 mt-16">
      <div class="flex items-center gap-4">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          :aria-label="link.name"
          class="text-xl"
        >
          <Icon :name="link.icon" />
        </a>
      </div>
      <a
        :href="`mailto:${email.address}`"
        class="flex items-center gap-2 text-sm group w-auto mt-2"
        aria-label="E-posta gönder"
      >
        <Icon :name="email.icon" class="text-xl" />
        <span
          class="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full
                 after:origin-left after:scale-x-0 after:bg-current after:transition-transform"
        >
          {{ email.address }}
        </span>
      </a>
    </div>
  </main>
</template>
