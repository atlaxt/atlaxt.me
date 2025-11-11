<script setup lang="ts">
const { data: page } = await useAsyncData(
  'books',
  () => queryCollection('books').first(),
)

const header = ref<string>()
const description = ref<string>()
const books = ref<Book[]>()

const showOnlyIsRead = ref<boolean>(false)
const currentBookList = computed(() => {
  if (showOnlyIsRead.value) {
    return books.value?.filter((item: Book) => item.isRead) || []
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
  <div class="lg:w-3xl lg:px-0 px-2 mx-auto mt-36">
    <u-checkbox v-model="showOnlyIsRead" color="neutral" label="Readed Only" />
    <h1 class="mt-2">
      {{ header }}
    </h1>
    <p class="mt-8">
      {{ description }}
    </p>
    <div class="flex flex-col mt-12 gap-4">
      <div
        v-for="(book, key) in currentBookList"
        :key="key"
        class="py-2 flex flex-row justify-between rounded-lg hover:bg-zinc-100/25 dark:hover:bg-zinc-900/25 transition-colors" :class="{
          'opacity-50': !book.isRead,
        }" :book="book"
      >
        <h1 class="font-medium text-lg">
          <span class="text-sm opacity-70 mr-1"> {{ book.number }}. </span>
          {{ book.name }}
          <span class="text-sm opacity-70">
            {{ book.author }}
          </span>
        </h1>
        <div v-if="book.isRead" class="flex items-end font-bold whitespace-nowrap">
          <span> {{ `${book.rate}/10` }} </span>
        </div>
      </div>
    </div>
  </div>
</template>
