import type { ArchitectureIndex, DocNode, GraphEdge } from '../types'
import type { FileMap } from './fs-access'
import { extractMarkdownLinks, fileName, parseFrontmatter } from './okf-parse'

function isStormPath(path: string): boolean {
  return path.toLowerCase().endsWith('.storm.json')
}

export function buildArchitectureIndex(rootLabel: string, files: FileMap): ArchitectureIndex {
  const docs = new Map<string, DocNode>()

  for (const [path, content] of files) {
    if (isStormPath(path)) {
      docs.set(path, {
        path,
        name: fileName(path),
        kind: 'storm',
        content,
        meta: { type: 'e2-board-snapshot', title: fileName(path) },
        links: [],
      })
      continue
    }
    if (!path.toLowerCase().endsWith('.md')) continue

    const { meta, body } = parseFrontmatter(content)
    const links = extractMarkdownLinks(path, body)
    docs.set(path, {
      path,
      name: fileName(path),
      kind: 'markdown',
      content,
      meta,
      links,
    })
  }

  const edges: GraphEdge[] = []
  for (const doc of docs.values()) {
    if (doc.kind !== 'markdown') continue
    for (const to of doc.links) {
      let resolved = to
      if (!docs.has(to)) {
        const hit = [...docs.keys()].find((k) => k === to || k.endsWith('/' + to) || k.endsWith(to))
        if (hit) resolved = hit
      }
      edges.push({ from: doc.path, to: resolved, broken: !docs.has(resolved) })
    }
  }

  // Re-link broken edges that resolve via basename match within the same folder tree
  for (const edge of edges) {
    if (!edge.broken) continue
    const base = edge.to.includes('/') ? edge.to.slice(edge.to.lastIndexOf('/') + 1) : edge.to
    const hit = [...docs.keys()].find((k) => k === edge.to || k.endsWith('/' + base))
    if (hit) {
      edge.to = hit
      edge.broken = false
    }
  }

  return {
    rootLabel,
    docs,
    edges,
    openedAt: new Date().toISOString(),
  }
}

export function treePaths(docs: Map<string, DocNode>): string[] {
  return [...docs.keys()].sort((a, b) => a.localeCompare(b))
}

export function uniqueTypes(docs: Map<string, DocNode>): string[] {
  const set = new Set<string>()
  for (const d of docs.values()) {
    if (d.meta?.type) set.add(String(d.meta.type))
  }
  return [...set].sort()
}
