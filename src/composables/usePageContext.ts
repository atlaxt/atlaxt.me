import { ref } from 'vue'

export interface TocItem {
  id: string
  text: string
  level: 2 | 3
}

const subTitle = ref<string | null>(null)
const subParent = ref<string | null>(null)
const tocItems = ref<TocItem[]>([])

export function usePageContext() {
  function setSubTitle(title: string | null, parent?: string) {
    subTitle.value = title
    subParent.value = parent ?? null
  }

  function setTocItems(items: TocItem[]) {
    tocItems.value = items
  }

  return { subTitle, subParent, tocItems, setSubTitle, setTocItems }
}
