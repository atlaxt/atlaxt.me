import type { ButtonProps } from '@nuxt/ui'

export function useSocial() {
  const github: ButtonProps = {
    // label: 'GitHub',
    to: 'https://github.com/atlaxt',
    icon: 'lucide:github',
  }

  const npm = {
    // label: 'npm',
    to: 'https://www.npmjs.com/~atlasyigitaydin',
    icon: 'nonicons:npm-16',
  }

  const linkedIn: ButtonProps = {
    // label: 'LinkedIn',
    to: 'https://linkedin.com/in/atlaxt',
    icon: 'lucide:linkedin',
  }

  const instagram: ButtonProps = {
    // label: 'Instagram',
    to: 'https://instagram.com/atlaxt.me',
    icon: 'lucide:instagram',
  }

  const x: ButtonProps = {
    // label: 'X',
    to: 'https://x.com/atlaxtt',
    icon: 'hugeicons:new-twitter',
  }

  const bluesky: ButtonProps = {
    // label: 'Bluesky',
    to: 'https://bsky.app/profile/atlaxt.me',
    icon: 'proicons:bluesky',
  }

  const email: ButtonProps = {
    label: 'atlasyigitaydin@gmail.com',
    icon: 'lucide:mail',
    to: 'mailto:atlasyigitaydin@gmail.com',
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
