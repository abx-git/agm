import type { ProjectParams, WorkflowEntry } from '../types'
import { normDocRoot, resolvedTemplate } from './project-params'

const TEMPLATE_HINTS: Record<string, string> = {
  arc42: 'arc42/runtime.md',
  'c4-light': 'c4-light/components.md',
  'adr-first': 'adr-first/views.md',
  'lean-service': 'lean-service/runtime.md',
  custom: 'custom/overview.md',
}

export function substituteTemplate(text: string, templateId: string): string {
  const t = templateId || 'arc42'
  const example = TEMPLATE_HINTS[t] || `${t}/overview.md`
  let out = String(text)
    .replace(/<template-example-section>/g, example)
    .replace(/<template>/g, t)
  out = out
    .replace(/\barc42\/decisions\/?/gi, `${t}/decisions/`)
    .replace(/\barc42\b/g, t)
  return out
}

export function substituteDocRoot(text: string, docRoot: string): string {
  const norm = normDocRoot(docRoot)
  const noSlash = norm.replace(/\/$/, '')
  return String(text)
    .replace(/\$\{docRoot\}\//g, norm)
    .replace(/\$\{docRoot\}/g, noSlash)
    .replace(/docs\/tekto\//g, norm)
    .replace(/docs\/tekto(?![/\w])/g, noSlash)
    .replace(/docs\/architecture\//g, norm)
    .replace(/docs\/architecture(?![/\w])/g, noSlash)
    .replace(/<doc-root>\//g, norm)
    .replace(/<doc-root>/g, noSlash)
}

function buildStudioPromptNote(): string {
  return [
    '## Prompts (Tekto Studio)',
    '',
    'Session instructions come from **Tekto Studio**. Use skills under packs/skills or `.cursor/skills/tekto/`.',
    'Human-in-the-loop: evidence required. Keep steer.md and log.md current.',
    '**Do not create empty stub files.** Create a file only when you have real content for that checklist item (or when the human explicitly asks). Prefer one evidence-based chapter per session.',
    '',
    '### Non-durable sources (hard rule)',
    '',
    '- **`notes/`** — local user notes (often gitignored). Do **not** read, write, or promote them unless the human explicitly asks in this session.',
    '- **Concepts / Analyses** (`process/spikes/`, legacy `work/`) — exploration drafts. Do **not** copy them into lasting Architecture / Knowledge chapters as established truth unless the human explicitly asks to promote specific findings.',
    '- Prefer evidence from: source code, steer.md, chapters, interfaces/, findings with evidence paths.',
    '',
  ].join('\n')
}

/** Neutralize on-disk role-file instructions for Studio-copied prompts. */
export function stripDocRootRolePaths(text: string, docRoot: string): string {
  const r = normDocRoot(docRoot)
  const noSlash = r.replace(/\/$/, '')
  let out = text
  const patterns = [
    new RegExp(`${noSlash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/prompts/role-[\\w-]+\\.md`, 'gi'),
    new RegExp(`${r.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}prompts/role-[\\w-]+\\.md`, 'gi'),
    /<doc-root>\/?prompts\/role-[\w-]+\.md/gi,
    /\$\{docRoot\}\/?prompts\/role-[\w-]+\.md/gi,
    /docs\/architecture\/prompts\/role-[\w-]+\.md/gi,
    /prompts\/role-[\w-]+\.md/gi,
  ]
  for (const re of patterns) {
    out = out.replace(re, '(use Tekto skills — skip on-disk role files)')
  }
  return out
}

function buildCoreFilesBlock(docRoot: string): string {
  const r = normDocRoot(docRoot)
  return [
    '## Core files (keep simple)',
    '',
    `- ${r}steer.md — links + ## Now (max 5 tasks). Put in AI context.`,
    `- ${r}log.md — one line per change (audit).`,
    '',
    'Update steer when navigation changes; append log on every merged doc change.',
    '',
  ].join('\n')
}

function buildParameterBlock(params: ProjectParams): string {
  const docRoot = normDocRoot(params.docRoot)
  const template = resolvedTemplate(params)
  const lines = [
    '## Project parameters',
    '',
    `- Application: ${params.appName || '(unnamed)'}`,
    `- Documentation root: ${docRoot}`,
    `- Template: ${template}`,
    `- AI tool: ${params.aiTool}`,
  ]
  if (params.purpose) lines.push(`- Purpose: ${params.purpose}`)
  if (params.stack) lines.push(`- Stack: ${params.stack}`)
  if (params.sourceRoot) lines.push(`- Source root: ${params.sourceRoot}`)
  lines.push('')
  lines.push(
    `Resolve every architecture file under Documentation root (${docRoot}). Do not use a different docs path unless the human explicitly changes it.`,
  )
  lines.push('')
  return lines.join('\n')
}

function applyWorkflowInputs(
  prompt: string,
  workflowId: string,
  values: Record<string, string | boolean | undefined>,
): string {
  let out = prompt
  const map: Record<string, string | boolean | undefined> = {
    'your question here': values.question,
    'e.g. payment integration resilience': values.topic,
    'modules, services, or template sections': values.scope,
    'e.g. coupling, failure modes, security, performance': values.focus,
    'e.g. add circuit breaker between order-service and payment-service': values.goal,
    'optional: latency, no new infra, etc.': values.constraints,
    'paste git diff or PR diff summary': values.gitDiff,
    'pasted-content': values.pastedContent,
    'source-label': values.sourceLabel,
    'source-type': values.sourceType,
    goal: values.goal,
    scope: values.scope,
    slug: values.slug,
    'diff-from': values.diffFrom,
    'diff-to': (values.diffTo as string) || 'HEAD',
    'proposal-path': values.proposalPath,
    'proposal-paths': values.proposalPaths || values.proposalPath,
    notes: values.notes,
    'raw-paths': values.rawPaths,
    'dry-run': values.dryRun,
    template: values.template,
  }
  for (const [placeholder, val] of Object.entries(map)) {
    if (val == null || val === '') continue
    const escaped = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    out = out.replace(new RegExp(`<${escaped}>`, 'g'), String(val))
  }
  if (values.slug) {
    out = out.replace(/YYYY-MM-DD-<slug>/g, `YYYY-MM-DD-${values.slug}`)
    out = out.replace(/<slug>/g, String(values.slug))
  }
  if (values.gitDiff) {
    out = out.replace(/<paste git diff or PR diff summary>/g, String(values.gitDiff))
  }
  if (values.pastedContent) {
    out = out.replace(/<pasted-content>/g, String(values.pastedContent))
  }
  void workflowId
  return out
}

function workflowSessionTitle(workflow: WorkflowEntry): string {
  const first = String(workflow.prompt || '')
    .split('\n')
    .map((l) => l.trim())
    .find(Boolean)
  if (first?.startsWith('AGM')) {
    return first.replace(/^AGM\s*[—–-]\s*/, '').trim()
  }
  const track = workflow.track || 'Session'
  const activity = workflow.activity || workflow.id
  return `${track} · ${activity}`
}

export function buildAdoptPrompt(
  base: string,
  params: ProjectParams,
  contextPackBlock = '',
): string {
  let prompt = substituteTemplate(substituteDocRoot(base, params.docRoot), resolvedTemplate(params))
  prompt = stripDocRootRolePaths(prompt, params.docRoot)
  const blocks = [
    buildParameterBlock(params),
    buildStudioPromptNote(),
    contextPackBlock.trim() || buildCoreFilesBlock(params.docRoot),
  ]
  return `${blocks.join('\n')}\n---\n\n${prompt}`
}

export function personalizeWorkflowPrompt(
  workflow: WorkflowEntry,
  params: ProjectParams,
  inputValues: Record<string, string | boolean | undefined> = {},
  contextPackBlock = '',
): string {
  let prompt = substituteDocRoot(workflow.prompt, params.docRoot)
  prompt = substituteTemplate(prompt, resolvedTemplate(params))
  prompt = applyWorkflowInputs(prompt, workflow.id, inputValues)
  prompt = stripDocRootRolePaths(prompt, params.docRoot)
  prompt = prompt
    .replace(/^Workflow:\s*\S+\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  const header = [
    buildParameterBlock(params).trimEnd(),
    '',
    buildStudioPromptNote().trimEnd(),
    '',
    contextPackBlock.trim() || buildCoreFilesBlock(params.docRoot).trimEnd(),
    '',
    `## Session: ${workflowSessionTitle(workflow)}`,
    '',
  ].join('\n')
  return `${header}\n${prompt}`
}

export function personalizeWorkflowWhen(workflow: WorkflowEntry, params: ProjectParams): string {
  return substituteTemplate(
    substituteDocRoot(workflow.when || '', params.docRoot),
    resolvedTemplate(params),
  )
}

export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    /* fallback */
  }
  const ta = document.createElement('textarea')
  ta.value = text
  ta.setAttribute('readonly', '')
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    ta.remove()
  }
}
