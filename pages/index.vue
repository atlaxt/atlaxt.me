<script setup lang="ts">
import Link from '@/components/link.vue'

definePageMeta({
  name: 'home',
})
const projects = [
  {
    label: 'STARS',
    links: {
      live: 'https://stars.atlasyigitaydin.com/',
      github: 'https://github.com/atlasyigitaydin/stars',
    },
  },
  {
    label: 'QR',
    links: {
      live: 'https://qr.atlasyigitaydin.com/',
      github: 'https://github.com/atlasyigitaydin/qr',
    },
  },
  {
    label: 'FOXIAN',
    info: 'not responsive',
    links: {
      live: 'https://foxian.atlasyigitaydin.com/',
      github: 'https://github.com/atlasyigitaydin/foxian',
    },
  },
]

// const items = [
//   {
//     label: 'projects.',
//     id: 'projects',
//     color: 'green',
//   },
//   {
//     label: 'works.',
//     id: 'works',
//     color: 'blue',
//   },
//   {
//     label: 'packages.',
//     id: 'packages',
//     color: 'red',
//   },
// ]
const selectedItem = ref<string>('projects')
onMounted(() => {
  if (!selectedItem.value) {
    selectedItem.value = 'projects'
  }
})
</script>

<template>
  <NuxtLayout>
    <div class="lg:w-96 md:w-10/12 w-full lg:px-0 md:px-0 px-2 flex flex-col h-full justify-start pb-12 items-start relative">
      <Header />

      <div class="flex flex-col gap-4 w-full justify-center h-full">
        <!-- <div class="w-full flex justify-end gap-4 mb-2">
        <Nav
          v-for="(item, key) in items" :key
          :label="item.label"
          :class="{
            'text-green-400': selectedItem === 'projects',
            'text-blue-400': selectedItem === 'works',
            'text-red-400': selectedItem === 'packages',
          }"
          @click="selectedItem = item.id"
        />
        </div> -->
        <Link
          v-for="(link, key) in projects"
          :key
          :label="link.label"
          :links="link.links"
          :info="link.info"
        />
      </div>
    </div>

    <MyGithubLink class="fixed bottom-0" />
  </NuxtLayout>
</template>
