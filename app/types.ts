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

  export interface Book {
    number: number
    code: number
    name: string
    author: string
    rate: number
    isRead: boolean
  }

  export interface Actor {
    id: number
    login: string
    display_login?: string
    avatar_url: string
    url: string
  }
  export interface Repo {
    id: number
    name: string // e.g. atlaxt/mockly
    url: string // api url
  }
  export interface WatchPayload { action: 'started' }
  export type CreatePayload
  = | { ref: string | null, ref_type: 'repository' | 'branch' | 'tag', master_branch?: string | null, description?: string | null, pusher_type?: string }
  export interface IssuesPayload {
    action: 'opened' | 'closed' | 'reopened'
    issue: {
      number: number
      title: string
      html_url: string
    }
  }
  export type GitHubEvent
  = | { type: 'WatchEvent', repo: Repo, payload: WatchPayload, created_at: string, actor: Actor }
    | { type: 'CreateEvent', repo: Repo, payload: CreatePayload, created_at: string, actor: Actor }
    | { type: 'IssuesEvent', repo: Repo, payload: IssuesPayload, created_at: string, actor: Actor }

}
