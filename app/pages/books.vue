<script setup lang="ts">
definePageMeta({ name: 'books' })

const { data: page } = await useAsyncData(
  'books-page',
  () => queryCollection('books').first(),
)

const showOnlyIsRead = ref<boolean>(false)

const header = ref<string>()
const description = ref<string>()
const books = ref<Book[]>()

const currentBookList = computed(() => {
  if (showOnlyIsRead.value) {
    return books.value?.filter(item => item.isRead) || []
  }
  return books.value || []
})

onMounted(() => {
  if (page.value) {
    header.value = page.value.header
    description.value = page.value.description
    books.value = page.value.books.map((item) => {
      return {
        ...item,
        name: typeof item.name === 'string' ? item.name.split('/')[0]!.trim() : String(item.name || ''),
        isRead: !!(item.rate),
      }
    })
  }
})
</script>

<template>
  <div class="lg:w-3xl lg:px-0 px-2 mx-auto mt-12 content-wrapper">
    <div class="flex flex-col">
      <filter-checkbox v-if="books" v-model="showOnlyIsRead" label="Readed Only" />
      <h1 class="mt-2">
        {{ header }}
      </h1>
    </div>
    <p class="mt-8">
      {{ description }}
    </p>
    <div class="flex flex-col mt-12 gap-4">
      <CardBook v-for="(book, key) in currentBookList" :key="key" :book="book" />
    </div>
  </div>
</template>
