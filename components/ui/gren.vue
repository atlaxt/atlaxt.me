<template>
  <svg
    class="absolute inset-0 w-full h-full dark:lg:opacity-25 dark:opacity-30 lg:opacity-80 opacity-95 -z-[999]"
    viewBox="0 0 2000 2000"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="none"
  >
    <filter id="noiseFilter">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
    </filter>

    <rect
      width="100%"
      height="100%"
      filter="url(#noiseFilter)"
    />
  </svg>
</template>
