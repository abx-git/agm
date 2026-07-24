import { parse as parseYaml } from 'yaml'
import type { OkfMeta } from '../types'

const MD_LINK_RE = /\[([^\]]*)\]\(([^)]+)\)/g
const ANGLE_LINK_RE = /<(?!https?:|mailto:)([^>\s]+\.md(?:#[^>\s]*)?)>/gi

export function parseFrontmatter(raw: string): { meta: OkfMeta | null; body: string } {
  if (!raw.startsWith('---')) {
    return { meta: null, body: raw }
  }
  const end = raw.indexOf('\n---', 3)
  if (end === -1) {
    return { meta: null, body: raw }
  }
  const yamlText = raw.slice(3, end).trim()
  const body = raw.slice(end + 4).replace(/^\r?\n/, '')
  try {
    const parsed = parseYaml(yamlText)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      const meta = parsed as OkfMeta
      if (typeof meta.type === 'string' && meta.type.trim()) {
        return { meta, body }
      }
    }
  } catch {
    /* ignore invalid YAML */
  }
  return { meta: null, body: raw }
}

/** Normalize a relative markdown href to a folder-relative path (no leading ./). */
export function resolveRelativePath(fromPath: string, href: string): string | null {
  const cleaned = href.trim().split('#')[0]?.split('?')[0] ?? ''
  if (!cleaned || cleaned.startsWith('http://') || cleaned.startsWith('https://') || cleaned.startsWith('mailto:') || cleaned.startsWith('data:')) {
    return null
  }
  if (cleaned.startsWith('/')) return null

  const fromDir = fromPath.includes('/') ? fromPath.slice(0, fromPath.lastIndexOf('/')) : ''
  const parts = (fromDir ? `${fromDir}/` : '') + cleaned
  const stack: string[] = []
  for (const part of parts.replace(/\\/g, '/').split('/')) {
    if (!part || part === '.') continue
    if (part === '..') {
      stack.pop()
      continue
    }
    stack.push(part)
  }
  return stack.join('/')
}

export function extractMarkdownLinks(fromPath: string, markdown: string): string[] {
  const targets = new Set<string>()
  for (const match of markdown.matchAll(MD_LINK_RE)) {
    const href = match[2]?.trim()
    if (!href) continue
    const resolved = resolveRelativePath(fromPath, href)
    if (resolved) targets.add(resolved)
  }
  for (const match of markdown.matchAll(ANGLE_LINK_RE)) {
    const href = match[1]?.trim()
    if (!href) continue
    const resolved = resolveRelativePath(fromPath, href)
    if (resolved) targets.add(resolved)
  }
  return [...targets]
}

export function fileName(path: string): string {
  const i = path.lastIndexOf('/')
  return i >= 0 ? path.slice(i + 1) : path
}
