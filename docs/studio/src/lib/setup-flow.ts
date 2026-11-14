import type { InstallStatus, JourneyPhase } from '../types'

export const SETUP_STEPS = [
  { id: 'folder' as const, label: '1. Folder', detail: 'Choose where steer.md lives' },
  { id: 'starter' as const, label: '2. Starter', detail: 'Write steer.md + log.md' },
] as const

export type SetupStepId = (typeof SETUP_STEPS)[number]['id']

export function showSetupStepper(
  _folderLabel: string | null,
  installStatus: InstallStatus,
  phase: JourneyPhase
): boolean {
  if (installStatus === 'ready') return false
  return phase === 'connect' || phase === 'install'
}

export function activeSetupStep(
  folderLabel: string | null,
  phase: JourneyPhase
): SetupStepId {
  if (!folderLabel || phase === 'connect') return 'folder'
  return 'starter'
}

export function setupStepState(
  stepId: SetupStepId,
  active: SetupStepId
): 'done' | 'current' | 'upcoming' {
  const order: SetupStepId[] = ['folder', 'starter']
  const ai = order.indexOf(active)
  const si = order.indexOf(stepId)
  if (si < ai) return 'done'
  if (si === ai) return 'current'
  return 'upcoming'
}