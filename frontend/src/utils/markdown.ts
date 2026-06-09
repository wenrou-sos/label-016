import { marked } from 'marked'
import hljs from 'highlight.js'

marked.use({
  renderer: {
    code(code: string, lang: string | undefined) {
      const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
      try {
        const highlighted = hljs.highlight(code, { language }).value
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`
      } catch (__) {
        return `<pre><code class="hljs">${code}</code></pre>`
      }
    }
  }
})

marked.setOptions({
  breaks: true,
  gfm: true
})

export function renderMarkdown(content: string): string {
  try {
    return marked.parse(content) as string
  } catch (e) {
    return content
  }
}
