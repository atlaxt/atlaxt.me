import { defineCollection, defineContentConfig } from '@nuxt/content'
import { z } from 'zod'

const projectItem = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  link: z.string().url(),
})

export default defineContentConfig({
  collections: {
    me: defineCollection({
      type: 'page',
      source: './me.md',
    }),
    projects: defineCollection({
      type: 'data',
      source: './projects.md',
      schema: z.object({
        projects: z.object({
          documentation: z.array(projectItem),
          npmPackages: z.array(projectItem),
          starterTemplates: z.array(projectItem),
          developerTools: z.array(projectItem),
          generativeArts: z.array(projectItem),
          justForFun: z.array(projectItem),
          works: z.array(projectItem),
        }),
      }),
    }),
  },
})
