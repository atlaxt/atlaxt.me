<template>
  <div
    class="
    fixed left-0 top-0 w-screen h-dvh
    flex flex-col overflow-y-scroll scroll-smooth
    bg-gradient-to-b
    dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900
    from-zinc-300 via-zinc-200 to-zinc-100
    dark:text-zinc-200
    text-zinc-800
    pb-12
    "
  >
    <UiGren class="fixed" />

    <AppHeader class="" />
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>
