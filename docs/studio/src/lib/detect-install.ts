import type { FileMap } from './fs-access'
import type { InstallStatus } from '../types'

function hasPath(files: FileMap, suffix: string): boolean {
  for (const p of files.keys()) {
    if (p === suffix || p.endsWith('/' + suffix) || p.endsWith(suffix)) return true
  }
  return false
}

/** Detect AGM graph markers in an opened folder (doc-root contents). */
export function detectInstallStatus(files: FileMap): InstallStatus {
  const blueprint = hasPath(files, 'blueprint.md')
  const entry = hasPath(files, 'entry-point.md')
  const alwaysOn = hasPath(files, 'always-on.md') || hasPath(files, 'context/always-on.md')
  if (blueprint && entry && alwaysOn) return 'ready'
  if (blueprint || entry || alwaysOn) return 'partial'
  if (files.size === 0) return 'missing'
  // Folder has markdown but not AGM markers
  const anyMd = [...files.keys()].some((p) => p.endsWith('.md'))
  return anyMd ? 'partial' : 'missing'
}
