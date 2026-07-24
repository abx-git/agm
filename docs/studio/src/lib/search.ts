import Fuse from 'fuse.js'
import type { DocNode } from '../types'

export interface SearchHit {
  path: string
  title: string
  score?: number
}

export function createDocSearch(docs: Map<string, DocNode>) {
  const items = [...docs.values()].map((d) => ({
    path: d.path,
    title: (d.meta?.title as string) || d.name,
    type: d.meta?.type || d.kind,
    body: d.kind === 'markdown' ? d.content.slice(0, 8000) : d.name,
  }))

  const fuse = new Fuse(items, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'path', weight: 0.3 },
      { name: 'type', weight: 0.1 },
      { name: 'body', weight: 0.2 },
    ],
    threshold: 0.4,
    includeScore: true,
  })

  return (query: string): SearchHit[] => {
    const q = query.trim()
    if (!q) return []
    return fuse.search(q, { limit: 40 }).map((r) => ({
      path: r.item.path,
      title: r.item.title,
      score: r.score,
    }))
  }
}
