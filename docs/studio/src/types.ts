/** Intro screens */
export type SetupPhase = 'about' | 'start' | 'setup'

/** @deprecated legacy workspace ids — map to `project` */
export type WorkspaceId = 'architecture' | 'review' | 'compose' | 'session' | 'project'

export type JourneyPhase = SetupPhase | 'project'

/** @deprecated */
export type LegacyJourneyPhase = 'connect' | 'install' | SetupPhase | WorkspaceId

export function normalizePhase(phase: string): JourneyPhase {
  if (phase === 'connect' || phase === 'install') return 'setup'
  if (
    phase === 'architecture' ||
    phase === 'review' ||
    phase === 'compose' ||
    phase === 'session'
  ) {
    return 'project'
  }
  if (phase === 'about' || phase === 'start' || phase === 'setup' || phase === 'project') {
    return phase
  }
  return 'start'
}

/** Which Session tab to open when navigating from a workspace CTA. */
export type SessionIntent = 'adopt' | 'continue' | 'evolve' | 'verify' | 'aspect'

/** DocNode classification from path conventions. */
export type DocWorkspace =
  | 'architecture'
  | 'knowledge'
  | 'inbox'
  | 'notes'
  | 'concepts'
  | 'analyses'
  | 'meta'

export type InstallStatus = 'unknown' | 'missing' | 'ready' | 'partial'

export interface ProjectParams {
  appName: string
  template: string
  customTemplate: string
  docRoot: string // e.g. docs/tekto/
  aiTool: string
  purpose: string
  stack: string
  sourceRoot: string
}

export interface OkfMeta {
  type: string
  title?: string
  description?: string
  tags?: string[]
  timestamp?: string
  [key: string]: unknown
}

export interface DocNode {
  path: string
  name: string
  kind: 'markdown' | 'storm'
  content: string
  meta: OkfMeta | null
  links: string[]
  workspace: DocWorkspace
}

export interface GraphEdge {
  from: string
  to: string
  broken: boolean
}

export interface ArchitectureIndex {
  rootLabel: string
  docs: Map<string, DocNode>
  edges: GraphEdge[]
  openedAt: string
}

export interface WorkflowEntry {
  id: string
  track: string
  activity: string
  mode: string
  role: string
  group: string
  when: string
  prerequisite?: string
  freshChat?: boolean
  freshNote?: string
  anchors?: string[]
  steps?: string[]
  placeholders?: string[]
  prompt: string
}

/** @deprecated use JourneyPhase */
export type StudioMode = 'workflows' | 'browse'

export const DEFAULT_PROJECT: ProjectParams = {
  appName: '',
  template: 'arc42',
  customTemplate: '',
  docRoot: '',
  aiTool: 'cursor',
  purpose: '',
  stack: '',
  sourceRoot: '',
}

export const STORAGE_KEY = 'tekto-studio-project'

export function isProjectPhase(phase: JourneyPhase): boolean {
  return phase === 'project'
}

/** @deprecated use isProjectPhase */
export const isWorkspacePhase = isProjectPhase

export function isSetupPhase(phase: JourneyPhase): phase is SetupPhase {
  return phase === 'about' || phase === 'start' || phase === 'setup'
}
