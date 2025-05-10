<template>
  <div
    class="
    fixed left-0 top-0 w-screen h-screen
    flex flex-col overflow-y-auto scroll-smooth
    bg-gradient-to-b
    dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800
    from-zinc-200 via-zinc-100 to-zinc-50
    dark:text-zinc-200
    text-zinc-800
    "
  >
    <UiGren class="fixed" />

    <AppHeader class="" />

    <slot />
  </div>
</template>
