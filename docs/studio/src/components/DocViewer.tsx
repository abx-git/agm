import { useEffect, useMemo, useRef } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import mermaid from 'mermaid'
import type { DocNode } from '../types'
import { parseFrontmatter, resolveRelativePath } from '../lib/okf-parse'
import { isLikelyStormJson } from '../lib/e2/storm'

interface Props {
  doc: DocNode
  allDocs: Map<string, DocNode>
  onNavigate: (path: string) => void
  onOpenStorm: (path: string) => void
}

let mermaidReady = false

function ensureMermaid() {
  if (mermaidReady) return
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'neutral',
  })
  mermaidReady = true
}

function rewriteInternalLinks(html: string, fromPath: string, allDocs: Map<string, DocNode>): string {
  const container = document.createElement('div')
  container.innerHTML = html
  for (const a of container.querySelectorAll('a[href]')) {
    const href = a.getAttribute('href')
    if (!href) continue
    const resolved = resolveRelativePath(fromPath, href)
    if (!resolved) continue
    let hitPath: string | null = allDocs.has(resolved) ? resolved : null
    if (!hitPath) {
      const base = resolved.includes('/') ? resolved.slice(resolved.lastIndexOf('/') + 1) : resolved
      hitPath = [...allDocs.keys()].find((k) => k === resolved || k.endsWith('/' + base)) ?? null
    }
    if (hitPath) {
      a.setAttribute('href', '#')
      a.setAttribute('data-agm-path', hitPath)
      a.classList.add('agm-internal-link')
    }
  }
  return container.innerHTML
}

export function DocViewer({ doc, allDocs, onNavigate, onOpenStorm }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { meta, body } = useMemo(() => parseFrontmatter(doc.content), [doc.content])

  const stormLinks = useMemo(() => {
    return doc.links.filter((l) => l.endsWith('.storm.json') && allDocs.has(l))
  }, [doc.links, allDocs])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      ensureMermaid()
      const rawHtml = await marked.parse(body, { async: true })
      let html = DOMPurify.sanitize(rawHtml)
      html = rewriteInternalLinks(html, doc.path, allDocs)

      if (!ref.current || cancelled) return
      ref.current.innerHTML = html

      const blocks = ref.current.querySelectorAll('code.language-mermaid, pre > code.language-mermaid')
      let i = 0
      for (const code of blocks) {
        const pre = code.parentElement
        const source = code.textContent || ''
        const host = document.createElement('div')
        host.className = 'mermaid-host'
        const id = `mmd-${doc.path.replace(/[^a-z0-9]/gi, '-')}-${i++}`
        try {
          const { svg } = await mermaid.render(id, source)
          if (cancelled) return
          host.innerHTML = svg
          pre?.replaceWith(host)
        } catch (err) {
          host.className = 'mermaid-host mermaid-error'
          host.textContent = `Mermaid error: ${err instanceof Error ? err.message : String(err)}`
          pre?.replaceWith(host)
        }
      }

      // Detect fenced json that is an E2 board
      for (const code of ref.current.querySelectorAll('code.language-json')) {
        const text = code.textContent || ''
        if (!isLikelyStormJson(text)) continue
        const btn = document.createElement('button')
        btn.type = 'button'
        btn.className = 'btn storm-inline-btn'
        btn.textContent = 'Open as E2 board'
        btn.onclick = () => {
          // Store inline board under a virtual path? For MVP, copy to session — use first .storm.json sibling or alert
          const existing = [...allDocs.values()].find((d) => d.kind === 'storm')
          if (existing) onOpenStorm(existing.path)
        }
        code.parentElement?.insertAdjacentElement('afterend', btn)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [body, doc.path, allDocs, onOpenStorm])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement | null
      const a = t?.closest?.('a.agm-internal-link') as HTMLAnchorElement | null
      if (!a) return
      e.preventDefault()
      const path = a.getAttribute('data-agm-path')
      if (path) {
        if (path.endsWith('.storm.json')) onOpenStorm(path)
        else onNavigate(path)
      }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [onNavigate, onOpenStorm, doc.path])

  return (
    <article className="doc-viewer">
      <header className="doc-header">
        <h1>{(meta?.title as string) || doc.name}</h1>
        <p className="doc-meta">
          <code>{doc.path}</code>
          {meta?.type && <span className="badge">{meta.type}</span>}
        </p>
      </header>
      {stormLinks.length > 0 && (
        <div className="storm-links">
          <span>Linked E2 boards:</span>
          {stormLinks.map((p) => (
            <button key={p} type="button" className="btn" onClick={() => onOpenStorm(p)}>
              {p}
            </button>
          ))}
        </div>
      )}
      <div className="doc-body markdown-body" ref={ref} />
    </article>
  )
}
