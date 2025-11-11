import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const projectItem = z.object({
  name: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  link: z.string().url(),
})

const bookItem = z.object({
  number: z.number().min(1),
  code: z.number().min(1),
  name: z.string(),
  author: z.string(),
  rate: z.number().min(0).max(10),
})

export default defineContentConfig({
  collections: {

    me: defineCollection({
      type: 'page',
      source: 'me.md',
    }),

    projects: defineCollection({
      type: 'data',
      source: 'projects.md',
      schema: z.object({
        projects: z.object({
          documentation: z.array(projectItem),
          maxim: z.array(projectItem),
          npmPackages: z.array(projectItem),
          starterTemplates: z.array(projectItem),
          developerTools: z.array(projectItem),
          generativeArts: z.array(projectItem),
          justForFun: z.array(projectItem),
          works: z.array(projectItem),
        }),
      }),
    }),

    books: defineCollection({
      type: 'data',
      source: 'books.md',
      schema: z.object({
        header: z.string(),
        description: z.string(),
        books: z.array(bookItem),
      }),
    }),
  },
})
