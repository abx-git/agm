import type { FileMap } from './fs-access'
import type { InstallStatus } from '../types'

function hasPath(files: FileMap, suffix: string): boolean {
  for (const p of files.keys()) {
    if (p === suffix || p.endsWith('/' + suffix) || p.endsWith(suffix)) return true
  }
  return false
}

/** Detect Tekto markers in the opened doc folder. */
export function detectInstallStatus(files: FileMap): InstallStatus {
  const steer = hasPath(files, 'steer.md')
  const log = hasPath(files, 'log.md')
  if (steer && log) return 'ready'
  if (steer || log) return 'partial'
  if (files.size === 0) return 'missing'
  const anyMd = [...files.keys()].some((p) => p.endsWith('.md'))
  return anyMd ? 'partial' : 'missing'
}