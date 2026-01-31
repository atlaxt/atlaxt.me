export default defineAppConfig({
  ui: {
    colors: {
      primary: 'orange',
      secondary: 'zinc',
      neutral: 'zinc',
    },

    pageSection: {
      slots: {
        title: 'text-xl sm:text-2xl lg:text-2xl text-pretty tracking-tight font-bold text-highlighted',
        description: 'text-base sm:text-base text-muted',
      },
    },
  },
})
