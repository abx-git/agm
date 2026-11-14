import type { JourneyPhase, WorkspaceId } from '../types'

export const HELP_OVERVIEW = [
  {
    id: 'help-flow-map',
    title: 'Ablauf',
    bullets: [
      'Setup: Ordner + KI + Starter.',
      'Projekt: Dokumentation · Reviews · Analysen — alles in Git.',
      'Reviews für Team: „Für Team teilen“ kopiert Text für PR/Chat.',
    ],
  },
]

export const WORKSPACE_HELP: Record<
  'project' | 'setup',
  { title: string; summary: string; tips: string[] }
> = {
  project: {
    title: 'Projekt',
    summary: 'Drei Artefakt-Bereiche im gleichen gebundenen Ordner.',
    tips: [
      'Dokumentation — steer, Kapitel, Regeln.',
      'Reviews — findings.yaml, threads (KI + Menschen).',
      'Analysen — work/, chapters/.',
      'Prompt für KI — Seitenpanel, neuer Chat in der IDE.',
    ],
  },
  setup: {
    title: 'Setup',
    summary: 'Projekt wählen, KI-Tool, Starter schreiben.',
    tips: ['Chrome/Edge für Schreiben.', 'Danach: Projekt öffnen.'],
  },
}

export function helpKeyForPhase(phase: JourneyPhase): keyof typeof WORKSPACE_HELP {
  if (phase === 'project') return 'project'
  return 'setup'
}

// Legacy export for WorkspaceShell if still referenced
export type { WorkspaceId }