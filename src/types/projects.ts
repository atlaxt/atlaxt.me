export type ProjectLinkKind = 'live' | 'github' | 'npm'

export interface ProjectLink {
  kind: ProjectLinkKind
  url: string
}

export interface ProjectPreview {
  base?: string | null
  light?: string | null
  dark?: string | null
}

export interface Project {
  name: string
  links: ProjectLink[]
  preview?: ProjectPreview | null
}
