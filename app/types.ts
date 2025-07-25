declare global {

  export interface PhotoMate {
    text?: string
    lang?: string
  }

  export interface Photo extends PhotoMate {
    name: string
    url: string
  }

  export interface Project {
    name: string
    description: string
    icon: string
    link: string
  }

  export interface SocialLink {
    name: string
    url: string
    icon: string
  }
}
