import type { DocWorkspace, WorkspaceId } from '../types'

export function classifyDocPath(path: string, _spikeType?: string): DocWorkspace {
  const p = path.replace(/\\/g, '/').toLowerCase()

  if (/(^|\/)steer\.md$/.test(p) || /(^|\/)log\.md$/.test(p) || /(^|\/)index\.md$/.test(p)) {
    return 'meta'
  }

  if (/(^|\/)reviews\//.test(p) || /findings\.yaml$/.test(p) || /threads\.yaml$/.test(p)) {
    return 'architecture'
  }

  return 'architecture'
}

export function isAnalysisSpikeType(): boolean {
  return false
}

export function isConceptSpikeType(): boolean {
  return true
}

export function docMatchesWorkspace(workspace: DocWorkspace, active: WorkspaceId): boolean {
  if (active === 'session') return true
  if (active === 'architecture' || active === 'review' || active === 'compose') {
    return workspace === 'architecture' || workspace === 'meta'
  }
  return true
}

export function workflowsForWorkspace(ws: WorkspaceId): string[] {
  switch (ws) {
    case 'architecture':
      return ['tekto-understand', 'tekto-evolve']
    case 'review':
      return ['tekto-review-security']
    case 'session':
      return []
    default:
      return []
  }
}