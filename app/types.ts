declare global {
  export enum ProjectCategory {
    Documentation = 'documentation',
    NpmPackages = 'npmPackages',
    StarterTemplates = 'starterTemplates',
    DeveloperTools = 'developerTools',
    GenerativeArts = 'generativeArts',
    JustForFun = 'justForFun',
    Works = 'works',
  }

  export interface Project {
    name: string
    description: string
    icon: string
    link: string
    category: ProjectCategory
  }

  export interface Book {
    number: number
    code: string
    name: string
    author: string
    rate?: number | null
  }
}
