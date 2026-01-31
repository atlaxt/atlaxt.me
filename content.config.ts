import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

export default defineContentConfig({
  collections: {
    me_tr: defineCollection({
      type: 'page',
      source: 'tr/me.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    me_en: defineCollection({
      type: 'page',
      source: 'en/me.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    projects_en: defineCollection({
      type: 'data',
      source: 'en/projects.yaml',
    }),

    projects_tr: defineCollection({
      type: 'data',
      source: 'tr/projects.yaml',
    }),

    about_tr: defineCollection({
      type: 'page',
      source: 'tr/about.md',
    }),

    about_en: defineCollection({
      type: 'page',
      source: 'en/about.md',
    }),
  },
})
