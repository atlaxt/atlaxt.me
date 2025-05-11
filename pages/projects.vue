<script setup lang="ts">
definePageMeta({
  name: 'projects',
})

const projects = {
  documents: [
    {
      name: 'Git101',
      description: 'Git (Version Control System) book for beginners',
      icon: 'i-logos-git-icon',
      link: 'https://git101.atlaxt.me',
    },
  ],
  npmPackages: [
    {
      name: '@koijs/table-vue',
      description: 'Lightweight and highly customizable table component built to handle complex data displays. Features include sticky headers, zebra striping, auto-generated labels, and smooth integration into dashboards or admin panels.',
      icon: 'lucide:table-2',
      link: 'https://www.npmjs.com/package/@koijs/table-vue',
    },
  ],
  starterTemplates: [
    {
      name: 'Synthia',
      description: 'A stylish Nuxt 3 starter template with Nuxt UI, Tailwind, and modern auth flow.',
      icon: 'i-lucide-layout-template',
      link: 'https://synthia.atlaxt.me',
    },
  ],
  developerTools: [
    {
      name: 'ApiKoi',
      description: 'Access various types of mock data instantly via clean, ready-to-use endpoints.',
      icon: 'i-lucide-fish',
      link: 'https://apikoi.com',
    },
  ],
  generativeArts: [
    {
      name: '100 CSS',
      description: 'I am challenging my limits to improve my art',
      icon: 'i-lucide-circle-dot',
      link: 'https://100-css.atlaxt.me/',
    },
    {
      name: '100 Spline',
      description: 'I am challenging my limits to improve my art',
      icon: 'i-lucide-circle-dot',
      link: 'https://100-spline.atlaxt.me/',
    },
  ],
  justForFun: [
    {
      name: 'inkhub',
      description: 'Creative space where users can draw, share their artwork, and connect with others. Focuses on simplicity and expression, fostering a visual community experience.',
      icon: 'i-lucide-brush',
      link: 'https://inkhub.atlaxt.me',
    },
    {
      name: 'imoji',
      description: 'Minimal and efficient emoji explorer that supports instant search, category filtering, skin tone selection, and one-click copying, making it ideal for quick emoji access.',
      icon: 'lucide:smile',
      link: 'https://imoji.co',
    },
  ],
  works: [
    {
      name: 'Mega Yapı',
      description: 'As Mega Yapı, we offer aesthetic, functional and long-lasting solutions with glass balcony, PVC joinery and glass and mirror applications. We are always by your side with our reliable and professional service approach.',
      icon: '',
      link: 'https://www.yapimega.com/',
    },
  ],
}

const sections = [
  { title: 'Documents', items: projects.documents },
  { title: 'NPM Packages', items: projects.npmPackages },
  { title: 'Starter Templates', items: projects.starterTemplates },
  { title: 'Developer Tools', items: projects.developerTools },
  { title: 'Generative Arts', items: projects.generativeArts },
  { title: 'Just For Fun', items: projects.justForFun },
  { title: 'Works', items: projects.works },
]
</script>

<template>
  <div class="lg:w-3xl lg:px-0 px-2 flex flex-col gap-12 mx-auto mt-12">
    <!-- <h1 class="text-3xl font-semibold tracking-tight">
      Projects
    </h1> -->

    <section
      v-for="(section, index) in sections" :id="section.title.toLowerCase().replace(/\s+/g, '_')" :key="index"
      class="flex flex-col gap-3"
    >
      <a :href="`#${section.title.toLowerCase().replace(/\s+/g, '_')}`" class="group relative">
        <h2 class="text-3xl font-semibold">
          {{ section.title }}
          <span class="opacity-0 ml-1 group-hover:opacity-80 transition-opacity">#</span>
        </h2>
      </a>
      <div class="flex flex-col gap-2">
        <CardProject v-for="project in section.items" :key="project.name" :project="project" />
      </div>
    </section>
  </div>
</template>
