export function useSocial() {
  const github: SocialLink = {
    name: 'GitHub',
    url: 'https://github.com/atlaxt',
    icon: 'lucide:github',
  }

  const npm = {
    name: 'npm',
    url: 'https://www.npmjs.com/~atlasyigitaydin',
    icon: 'nonicons:npm-16',
  }

  const linkedIn: SocialLink = {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/atlaxt',
    icon: 'lucide:linkedin',
  }

  const instagram: SocialLink = {
    name: 'Instagram',
    url: 'https://instagram.com/atlaxt.me',
    icon: 'lucide:instagram',
  }

  const x: SocialLink = {
    name: 'X',
    url: 'https://x.com/atlaxtt',
    icon: 'hugeicons:new-twitter',
  }

  const bluesky: SocialLink = {
    name: 'Bluesky',
    url: 'https://bsky.app/profile/atlaxt.me',
    icon: 'proicons:bluesky',
  }

  const email = {
    address: 'atlasyigitaydin@gmail.com',
    icon: 'lucide:mail',
  }

  return {
    github,
    npm,
    linkedIn,
    instagram,
    x,
    bluesky,
    email,
  }
}
