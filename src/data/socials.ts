import socialsRaw from '../../content/social.yaml'

export interface Social {
  id: string
  label: string
  href: string
  route?: string
  external?: string
}

export const socials = socialsRaw as unknown as Social[]

export function getSocial(id: string): Social {
  return socials.find(s => s.id === id)!
}
