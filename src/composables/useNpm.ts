import { mdToHtml } from './useMarkdown'

// git+https://github.com/user/repo.git → https://raw.githubusercontent.com/user/repo/HEAD
function repoToRawBase(repoUrl: string): string | undefined {
  const m = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)/)
  if (!m)
    return undefined
  return `https://raw.githubusercontent.com/${m[1]}/${m[2]}/HEAD`
}

export async function fetchNpmReadme(pkg: string): Promise<string | null> {
  try {
    const encoded = pkg.replace(/^@/, '%40').replace('/', '%2F')
    const res = await fetch(`https://registry.npmjs.org/${encoded}`)
    if (!res.ok)
      return null
    const json = await res.json()
    if (!json.readme)
      return null
    const base = repoToRawBase(json.repository?.url ?? '')
    return mdToHtml(json.readme, base)
  }
  catch {
    return null
  }
}
