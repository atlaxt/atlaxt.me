<template>
  <div class="w-screen justify-center flex h-screen fixed left-0 top-0 bg-black text-white doto">
    <div class="flex flex-col items-start justify-around pt-12 px-6 relative lg:w-96 md:w-10/12 w-full">
      <slot />
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Doto&display=swap');

.doto {
  font-family: "Doto", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-variation-settings:
    "ROND" 0;
}
</style>
