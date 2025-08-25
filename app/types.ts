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

  export interface GitHubEvent {
    id: string
    type: string
    actor: {
      id: number
      login: string
      display_login: string
      gravatar_id: string
      url: string
      avatar_url: string
    }
    repo: {
      id: number
      name: string
      url: string
    }
    payload: {
      repository_id: number
      push_id: number
      size: number
      distinct_size: number
      ref: string
      head: string
      before: string
      commits: Array<{
        sha: string
        author: {
          email: string
          name: string
        }
        message: string
        distinct: boolean
        url: string
      }>
    }
    public: boolean
    created_at: string
  }

}
