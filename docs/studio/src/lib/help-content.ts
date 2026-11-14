import type { JourneyPhase, WorkspaceId } from '../types'

export interface HelpSection {
  id: string
  title: string
  body: string[]
}

/** Full help drawer — the “manual” inside Studio. */
export const HELP_OVERVIEW: HelpSection[] = [
  {
    id: 'idea',
    title: 'What Studio does',
    body: [
      'Tekto architecture lives under docs/tekto/ (steer.md + log.md). Studio does not call an LLM.',
      'Composer exports skills and rules for Cursor or Claude Code. Review UI edits findings/threads sidecars in Git.',
    ],
  },
  {
    id: 'loop',
    title: 'The loop (remember this)',
    body: [
      '1. Setup once — bind the folder and write the starter files.',
      '2. Ask AI · first fill — chapter with evidence; update steer.md + log.md.',
      '3. Ask AI · continue — from steer ## Now.',
      '4. Reload folder — after the AI wrote files.',
      'Setup writes steer.md, log.md, and folder stubs only.',
    ],
  },
  {
    id: 'files',
    title: 'Two files that steer everything',
    body: [
      'steer.md — links + ## Now (max 5 parallel tasks). Put this in the AI context.',
      'log.md — one-line audit trail (merge=union in .gitattributes).',
    ],
  },
  {
    id: 'workspaces',
    title: 'Workspaces',
    body: [
      'Architecture — lasting documentation (home). Brand logo returns here.',
      'Knowledge — domain language and model.',
      'Inbox — new information in three steps: receive → approve plan → apply.',
      'Notes — local scratch under notes/ (not for Git). Ask AI ignores them unless you explicitly include notes.',
      'Concepts — optional ideas that need not become official docs (not lasting truth until promoted).',
      'Analyses — optional looks at how the code works (not lasting truth until promoted).',
      'Ask AI — copy a prompt for Cursor / Claude / Copilot (Studio does not call an AI).',
      'Folder, Reload folder, Help, and Map live in the top bar. Map shows when files and terms appear.',
    ],
  },
  {
    id: 'glossary',
    title: 'Glossary',
    body: [
      'First fill — first documentation fill after Setup (also called Adopt in prompts).',
      'Next checklist — next open checklist item (also called Extend / continue in prompts).',
      'Inbox — bring external notes into the docs with a human check in between.',
      'Notes — local user scratch; not Git; not architecture truth unless you opt in.',
      'Reading list — small set of files the AI should open first.',
      'Concept / Analysis — exploration under process/spikes/; promote only when you decide.',
      'Doc check — AI quality report; does not fix docs in the same chat.',
      'Align folder — Ask AI inventories an existing tree and reformats it to Studio’s expected layout.',
      'Remember for AI — include a file in the next prompt’s reading list.',
    ],
  },
]

export const WORKSPACE_HELP: Record<
  WorkspaceId | 'setup' | 'connect' | 'install',
  { title: string; summary: string; tips: string[] }
> = {
  architecture: {
    title: 'Docs',
    summary: 'Tekto documentation under docs/tekto/. Browse; grow via skills and Ask AI.',
    tips: [
      'steer.md — links and ## Now (max 5 tasks).',
      'After agent edits, Reload folder.',
      'CLI: tekto check in CI.',
    ],
  },
  review: {
    title: 'Review',
    summary: 'Findings (YAML), threads, and reports under reviews/.',
    tips: [
      'Use tekto packet aspect <id> or review-revise in a fresh chat.',
      'Threads attach to finding IDs or headings.',
    ],
  },
  compose: {
    title: 'Composer',
    summary: 'Copy tekto init / export / check commands for your app repo.',
    tips: ['Run export after Studio install or when skills change.', 'MCP: tekto_record_finding'],
  },
  session: {
    title: 'Ask AI',
    summary: 'Copy prompts for Cursor / Claude — Studio does not call an LLM.',
    tips: [
      'Start from steer.md.',
      'Author chat ≠ review chat.',
    ],
  },
  setup: {
    title: 'Setup',
    summary: 'One-time: choose folder, write starter scaffold.',
    tips: ['Use Chromium for write access.', 'After starter, open Docs.'],
  },
  connect: {
    title: 'Setup — folder',
    summary: 'Bind docs/tekto (or your doc root).',
    tips: ['Bind the doc root folder, not always the repo root.'],
  },
  install: {
    title: 'Setup — starter',
    summary: 'Writes steer.md, log.md, and index stubs.',
    tips: ['Then run tekto export in the app repo for skills.', 'Re-run only to overwrite state files.'],
  },
}

export function helpKeyForPhase(phase: JourneyPhase): keyof typeof WORKSPACE_HELP {
  if (phase === 'about' || phase === 'start') return 'setup'
  if (phase === 'connect') return 'connect'
  if (phase === 'install') return 'install'
  if (phase === 'session') return 'session'
  return phase
}
