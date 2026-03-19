function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function inline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+?)`/g, `<code>$1</code>`)
    .replace(/\[([^\]]+?)\]\(([^)]+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
}

export function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let i = 0
  let inList = false
  let listOrdered = false

  const closeList = () => {
    if (inList) { out.push(listOrdered ? '</ol>' : '</ul>'); inList = false }
  }

  while (i < lines.length) {
    const raw = lines[i]!
    const trimmed = raw!.trim()

    // Fenced code block
    if (trimmed.startsWith('```')) {
      closeList()
      const lang = trimmed.slice(3).trim()
      i++
      const codeLines: string[] = []
      while (i < lines.length && !lines[i]!.trim().startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]!))
        i++
      }
      out.push(`<pre><code${lang ? ` class="language-${lang}"` : ''}>${codeLines.join('\n')}</code></pre>`)
      i++
      continue
    }

    // Headings
    const h = trimmed.match(/^(#{1,4})\s+(.+)/)
    if (h) {
      closeList()
      const level = h[1]!.length
      const tag = `h${Math.min(level, 4)}`
      out.push(`<${tag}>${inline(h[2]!)}</${tag}>`)
      i++; continue
    }

    // HR
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeList()
      out.push('<hr>')
      i++; continue
    }

    // Ordered list
    const ol = trimmed.match(/^\d+\.\s+(.+)/)
    if (ol) {
      if (!inList || !listOrdered) { closeList(); out.push('<ol>'); inList = true; listOrdered = true }
      out.push(`<li>${inline(ol[1]!)}</li>`)
      i++; continue
    }

    // Unordered list
    const ul = trimmed.match(/^[-*]\s+(.+)/)
    if (ul) {
      if (!inList || listOrdered) { closeList(); out.push('<ul>'); inList = true; listOrdered = false }
      out.push(`<li>${inline(ul[1]!)}</li>`)
      i++; continue
    }

    // Blank line
    if (!trimmed) {
      closeList()
      i++; continue
    }

    // Paragraph
    closeList()
    out.push(`<p>${inline(trimmed)}</p>`)
    i++
  }

  closeList()
  return out.join('\n')
}
