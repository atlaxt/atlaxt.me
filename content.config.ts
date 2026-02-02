import { defineCollection, defineContentConfig, z } from '@nuxt/content'

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
      schema: z.object({
        name: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        category: z.string().optional(),
        link: z.string().url().optional(),
      }),
    }),

    projects_tr: defineCollection({
      type: 'data',
      source: 'tr/projects.yaml',
      schema: z.object({
        name: z.string(),
        description: z.string(),
        icon: z.string().optional(),
        category: z.string().optional(),
        link: z.string().url().optional(),
      }),
    }),

    about_tr: defineCollection({
      type: 'page',
      source: 'tr/about.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    about_en: defineCollection({
      type: 'page',
      source: 'en/about.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
      }),
    }),

    blogs_tr: defineCollection({
      type: 'data',
      source: 'tr/blogs/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
        image: z.string(),
      }),
    }),

    // notes_tr: defineCollection({
    //   type: 'data',
    //   source: 'tr/notes/*.md',
    //   schema: z.object({
    //     title: z.string(),
    //     description: z.string(),
    //     date: z.string(),
    //     image: z.string(),
    //   }),
    // }),
  },
})
