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
  return String(text)
    .replace(/<doc-root>/g, norm)
    .replace(/docs\/architecture\//g, norm)
}

function buildAgentGraphDutiesBlock(docRoot: string): string {
  const r = normDocRoot(docRoot)
  return [
    '## Agent-maintained graph (always — not in documentation areas)',
    '',
    'The human does not select these; you create and maintain them every session:',
    `- ${r}entry-point.md — graph index (links to all content docs and sources)`,
    `- ${r}blueprint.md — construction plan, phase status, session log`,
    `- ${r}context/always-on.md — session context and source code map`,
    '',
    'When content areas change, update entry-point links and blueprint phases without being asked.',
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
  return lines.join('\n')
}

export function buildAdoptPrompt(base: string, params: ProjectParams): string {
  let prompt = substituteTemplate(substituteDocRoot(base, params.docRoot), resolvedTemplate(params))
  const blocks = [
    buildParameterBlock(params),
    buildAgentGraphDutiesBlock(params.docRoot),
  ]
  return `${blocks.join('\n')}\n---\n\n${prompt}`
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

export function personalizeWorkflowPrompt(
  workflow: WorkflowEntry,
  params: ProjectParams,
  inputValues: Record<string, string | boolean | undefined> = {},
): string {
  let prompt = substituteDocRoot(workflow.prompt, params.docRoot)
  prompt = substituteTemplate(prompt, resolvedTemplate(params))
  prompt = applyWorkflowInputs(prompt, workflow.id, inputValues)
  const header = [
    buildParameterBlock(params).trimEnd(),
    '',
    buildAgentGraphDutiesBlock(params.docRoot).trimEnd(),
    '',
    `## Workflow: ${workflow.id}`,
    '',
  ].join('\n')
  return `${header}\n${prompt}`
}

export function personalizeWorkflowWhen(workflow: WorkflowEntry, params: ProjectParams): string {
  return substituteTemplate(substituteDocRoot(workflow.when || '', params.docRoot), resolvedTemplate(params))
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
