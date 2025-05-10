<script setup lang="ts">
definePageMeta({
  name: 'home',
  path: '/',
})

const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/atlaxt',
    icon: 'lucide:github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/atlaxt',
    icon: 'lucide:linkedin',
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/atlas.y.a',
    icon: 'lucide:instagram',
  },
]

const email = {
  address: 'atlasyigitaydin@gmail.com',
  icon: 'lucide:mail',
}
</script>

<template>
  <section class="lg:w-3xl  lg:px-0 px-2 flex flex-col gap-8 mx-auto mt-12">
    <span class="text-4xl font-semibold tracking-tight text-balance"> Atlas Yiğit Aydın </span>

    <p>
      Hi! I'm Atlas Yiğit Aydın — a passionate frontend developer and digital creator.
    </p>

    <p>
      I spend most of my time building fast, accessible, and user-focused interfaces. I enjoy creating tools and
      projects that boost productivity and save developers time.
    </p>

    <p>
      I'm currently working as a frontend developer at <strong>trex Digital Manufacturing</strong>, where I'm
      responsible for building user interfaces for ERP systems and internal applications. Outside of work, I actively
      contribute to the open-source ecosystem and build my own side projects.
    </p>

    <p>
      While I mostly focus on developing UI components, developer tools, and test API services, my work isn't limited to
      just those. I like crafting solutions based on different needs and taking ownership of the entire process from
      start to finish.
      You can find more details on the
      <NuxtLink :to="{ name: 'projects' }" class="font-semibold dark:text-white text-black underline hover:opacity-80">
        projects
      </NuxtLink>
      page.
    </p>

    <p>
      Outside of code, I enjoy taking photos and collecting little things that catch my eye. If you're curious,
      feel free to
      <NuxtLink :to="{ name: 'photos' }" class="font-semibold dark:text-white text-black underline hover:opacity-80">
        check out my photo collection.
      </NuxtLink>
    </p>

    <p>
      If we share common interests — or even if you just want to say hi — feel free to reach out. Who knows, we might
      grab a coffee and create something together.
    </p>

    <div class="h-px w-sm bg-zinc-200 dark:bg-zinc-600" />

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <a
          v-for="link in socialLinks"
          :key="link.name"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-xl hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
        >
          <Icon :name="link.icon" />
        </a>
      </div>
      <a
        :href="`mailto:${email.address}`"
        class="flex items-center gap-2 text-sm group"
      >
        <Icon :name="email.icon" class="text-xl" />
        <span class="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform group-hover:after:scale-x-100">
          {{ email.address }}
        </span>
      </a>
    </div>
  </section>
</template>
