// ─── Fotoğraflar ─────────────────────────────────────────────
export interface Photo {
  file: string
  alt?: string
  location?: string
}

// ─── Kitaplık ────────────────────────────────────────────────
export interface Book {
  number: string
  code: string
  name: string
  author: string
  rate: string
}

// ─── Blog ─────────────────────────────────────────────────────
export interface PostFrontmatter {
  title: string
  description: string
  date: string
  image?: string
}

export interface Post {
  frontmatter: PostFrontmatter
  slug: string
}

// ─── Deneyim / Eğitim ────────────────────────────────────────
export interface ExperienceEntry {
  title: string
  company: string
  type: string
  start: string
  end: string
  location: string
  mode: string
}

export interface EducationEntry {
  degree: string
  level: string
  school: string | null
  initials: string | null
  period: string
  planned: boolean
}

// ─── CLI ──────────────────────────────────────────────────────
export interface ToolEntry {
  id: string
  package: string
  desc: string
}

export interface Template {
  name: string
  desc: string
  href: string
}

// ─── Sözler ───────────────────────────────────────────────────
export interface Quote {
  text: string
  author?: string
}

// ─── Feed ─────────────────────────────────────────────────────
export interface FeedSource {
  name: string
  url: string
  link: string
  category?: string
}

export interface FeedItem {
  title: string
  link: string
  date: Date
  source: string
  sourceLink: string
}
