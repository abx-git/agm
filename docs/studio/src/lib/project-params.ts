import { DEFAULT_PROJECT, STORAGE_KEY, type ProjectParams } from '../types'

export function loadProjectParams(): ProjectParams {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PROJECT }
    const parsed = JSON.parse(raw) as Partial<ProjectParams>
    return { ...DEFAULT_PROJECT, ...parsed }
  } catch {
    return { ...DEFAULT_PROJECT }
  }
}

export function saveProjectParams(params: ProjectParams): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(params))
}

export function normDocRoot(raw: string): string {
  let r = String(raw ?? '').trim()
  if (!r || r === '.') return './'
  r = r.replace(/\/+$/, '')
  if (r === '.') return './'
  return `${r}/`
}

export function resolvedTemplate(params: ProjectParams): string {
  if (params.template === 'custom') return params.customTemplate || 'custom'
  return params.template || 'arc42'
}
