export function useSocialLinks(): SocialLink[] {
  return [
    {
      name: 'GitHub',
      url: 'https://github.com/atlaxt',
      icon: 'lucide:github',
    },
    {
      name: 'npm',
      url: 'https://www.npmjs.com/~atlasyigitaydin',
      icon: 'nonicons:npm-16',
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com/in/atlaxt',
      icon: 'lucide:linkedin',
    },
    {
      name: 'Instagram',
      url: 'https://instagram.com/altaxt.me',
      icon: 'lucide:instagram',
    },
    {
      name: 'X',
      url: 'https://x.com/atlaxtt',
      icon: 'hugeicons:new-twitter',
    },
    {
      name: 'Bluesky',
      url: 'https://bsky.app/profile/atlaxt.me',
      icon: 'proicons:bluesky',
    },
  ]
}

export function useEmail() {
  return {
    address: 'atlasyigitaydin@gmail.com',
    icon: 'lucide:mail',
  }
}
