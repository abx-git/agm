import type { DocWorkspace, JourneyPhase, WorkspaceId } from '../types'

const COCKPIT_PHASE_KEY = 'tekto-studio-last-daily-phase'
const FOLDER_HINT_KEY = 'tekto-studio-folder-hint'
const BOOT_DONE_KEY = 'tekto-studio-boot-done'
const CONTEXT_PINS_KEY = 'tekto-studio-context-pins'
const DOC_FOCUS_KEY = 'tekto-studio-doc-focus'

export type CockpitPhase = WorkspaceId

const LEGACY_MAP: Record<string, CockpitPhase> = {
  run: 'session',
  spike: 'architecture',
  review: 'review',
  knowledge: 'architecture',
  inbox: 'architecture',
  notes: 'architecture',
  concepts: 'architecture',
  analyses: 'architecture',
}

export function isCockpitPhase(phase: JourneyPhase): phase is CockpitPhase {
  return phase === 'architecture' || phase === 'review' || phase === 'compose' || phase === 'session'
}

export function isDailyPhase(phase: JourneyPhase): phase is CockpitPhase {
  return isCockpitPhase(phase)
}

export function loadLastDailyPhase(): CockpitPhase {
  try {
    const raw = localStorage.getItem(COCKPIT_PHASE_KEY)
    if (!raw) return 'architecture'
    if (LEGACY_MAP[raw]) return LEGACY_MAP[raw]!
    if (isCockpitPhase(raw as JourneyPhase)) return raw as CockpitPhase
  } catch {
    /* ignore */
  }
  return 'architecture'
}

export function saveLastDailyPhase(phase: JourneyPhase): void {
  if (!isCockpitPhase(phase)) return
  try {
    localStorage.setItem(COCKPIT_PHASE_KEY, phase)
  } catch {
    /* ignore */
  }
}

export function loadFolderHint(): string | null {
  try {
    return localStorage.getItem(FOLDER_HINT_KEY)
  } catch {
    return null
  }
}

export function saveFolderHint(label: string | null): void {
  try {
    if (!label) localStorage.removeItem(FOLDER_HINT_KEY)
    else localStorage.setItem(FOLDER_HINT_KEY, label)
  } catch {
    /* ignore */
  }
}

export function loadBootDone(): boolean {
  try {
    return localStorage.getItem(BOOT_DONE_KEY) === '1'
  } catch {
    return false
  }
}

export function saveBootDone(done: boolean): void {
  try {
    if (done) localStorage.setItem(BOOT_DONE_KEY, '1')
    else localStorage.removeItem(BOOT_DONE_KEY)
  } catch {
    /* ignore */
  }
}

export function loadContextPins(): string[] {
  try {
    const raw = localStorage.getItem(CONTEXT_PINS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p): p is string => typeof p === 'string').slice(0, 24)
  } catch {
    return []
  }
}

export function saveContextPins(pins: string[]): void {
  try {
    localStorage.setItem(CONTEXT_PINS_KEY, JSON.stringify(pins.slice(0, 24)))
  } catch {
    /* ignore */
  }
}

export function loadDocFocus(): string[] {
  try {
    const raw = localStorage.getItem(DOC_FOCUS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter((p): p is string => typeof p === 'string')
  } catch {
    return []
  }
}

export function saveDocFocus(ids: string[]): void {
  try {
    localStorage.setItem(DOC_FOCUS_KEY, JSON.stringify(ids))
  } catch {
    /* ignore */
  }
}

export function workspaceLabel(ws: DocWorkspace | WorkspaceId): string {
  switch (ws) {
    case 'architecture':
      return 'Docs'
    case 'review':
      return 'Review'
    case 'compose':
      return 'Composer'
    case 'session':
      return 'Ask AI'
    case 'meta':
      return 'State'
    default:
      return String(ws)
  }
}