<script setup lang="ts">
const { data } = await useAsyncData(async () =>
  await queryCollection('books').first())

const onlyRead = ref(false)

const books = computed(() => {
  const allBooks = (data.value?.meta.body ?? []) as Book[]
  return onlyRead.value ? allBooks.filter(book => book.rate != null) : allBooks
})
</script>

<template>
  <UPage>
    <UPageSection :title="$t('books')" :description="$t('books_desc')">
      <template #links>
        <UCheckbox v-model="onlyRead" :label="$t('books_only_read')" />
      </template>
    </UPageSection>
    <UPageList v-if="books" class="gap-12 mt-4">
      <UPageCard
        v-for="book in books"
        :key="book.number"
        :title="`${book.number}. ${book.name}`"
        :description="book.rate != null ? `${book.author}` : book.author"
        :ui="{ root: 'rounded-none' }"
        variant="naked"
        orientation="vertical"
        class="duration-300 px-6"
        :class="{
          'opacity-70': !book.rate,
          'border-b border-transparent hover:border-accented ': book.rate,
        }"
      >
        <span v-if="book.rate"> {{ `• ${book.rate}/10` }} </span>
      </UPageCard>
    </UPageList>
  </UPage>
</template>
