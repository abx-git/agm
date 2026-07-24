import type { ProjectParams } from '../types'
import { resolvedTemplate } from './project-params'

function okf(type: string, title: string, body: string): string {
  const ts = new Date().toISOString().slice(0, 10)
  return [
    '---',
    `type: ${type}`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    'description: ""',
    'resource: "repo://"',
    'tags: [architecture]',
    `timestamp: "${ts}"`,
    '---',
    '',
    body.trim(),
    '',
  ].join('\n')
}

/** Day-1 scaffold written into the chosen architecture folder from AGM Studio (browser only). */
export function buildStarterScaffold(params: ProjectParams): Record<string, string> {
  const name = params.appName || 'My Application'
  const template = resolvedTemplate(params)
  const stack = params.stack || '<stack>'
  const purpose = params.purpose || '<one sentence domain>'
  const today = new Date().toISOString().slice(0, 10)

  const alwaysOn = okf(
    'architecture-context',
    'Base context — always on',
    `# Base context — always on

## System identity

**Application:** ${name}  
**Domain:** ${purpose}  
**Stack:** ${stack}

## Blueprint

- **Path:** [blueprint.md](../blueprint.md)
- **Entry:** [entry-point.md](../entry-point.md)
- **Index:** [index.md](../index.md)
- **Log:** [log.md](../log.md)
- **Template:** ${template}

## Source code map

| Module | Path |
|--------|------|
| — | ${params.sourceRoot || '—'} |

## Session protocol

1. Read always-on.md → blueprint.md → prompts/role-&lt;role&gt;.md.
2. Traverse Markdown links; verify [[ANCHOR:LINK_CHECK]] before stop.
`,
  )

  const blueprint = okf(
    'architecture-blueprint',
    'Blueprint',
    `# Blueprint — ${name}

Construction plan for the architecture graph. Status: \`[ ]\` open · \`[~]\` in progress · \`[x]\` done.

## Phases

| Status | Phase | Target |
|--------|-------|--------|
| [ ] | Context | context/always-on.md |
| [ ] | Introduction | ${template}/introduction.md |
| [ ] | Context view | ${template}/context.md |

## Spike register

| ID | Track | Title | Type | Path | Status | Date |
|----|-------|-------|------|------|--------|------|
| — | — | — | — | — | — | — |

## Session log

| Date | Summary |
|------|---------|
| ${today} | Starter scaffold written from AGM Studio |
`,
  )

  const entry = okf(
    'architecture-entry',
    'Entry point',
    `# Entry point — ${name}

Graph index (links only). Humans read template sections; agents start here.

## Orchestration

- [always-on.md](context/always-on.md)
- [blueprint.md](blueprint.md)
- [index.md](index.md)
- [log.md](log.md)

## Template

- [${template}/](${template}/)

## Spikes

- [spikes/](spikes/)

## Prompts

- [role-bootstrap.md](prompts/role-bootstrap.md)
- [role-maintenance.md](prompts/role-maintenance.md)
- [role-review.md](prompts/role-review.md)
`,
  )

  const index = okf(
    'architecture-index',
    'Architecture index',
    `# Architecture — ${name}

- [Entry point](entry-point.md)
- [Blueprint](blueprint.md)
- [Always-on context](context/always-on.md)
- [Spikes](spikes/)
- Template: [${template}](${template}/)
`,
  )

  const log = okf(
    'architecture-log',
    'Change log',
    `# Log

| Date | Change |
|------|--------|
| ${today} | Starter scaffold installed from AGM Studio |
`,
  )

  const roleBootstrap = okf(
    'architecture-role',
    'Role — bootstrap',
    `# Role: bootstrap

You are the bootstrap scribe for AGM. Follow the active workflow session prompt from AGM Studio.
Maintain blueprint.md, entry-point.md, and context/always-on.md every session.
Human-in-the-loop: propose; do not silently invent architecture.
Write new explorations under spikes/YYYY-MM-DD-&lt;slug&gt;/ (SPK register), not flat work/ files.
`,
  )

  const roleMaintenance = okf(
    'architecture-role',
    'Role — maintenance',
    `# Role: maintenance

Keep the architecture graph aligned with the codebase. Prefer evidence from diffs and source.
Update blueprint status and log.md each session. Output [[ANCHOR:LINK_CHECK]].
`,
  )

  const roleReview = okf(
    'architecture-role',
    'Role — review',
    `# Role: review

Review architecture docs for consistency, broken links, and untraceable claims.
Write findings into a spike under spikes/YYYY-MM-DD-review-&lt;slug&gt;/notes.md when asked.
`,
  )

  const intro = okf(
    'architecture-section',
    `${template} introduction`,
    `# Introduction

<!-- Fill during Adopt / Continue sessions -->

## Goals

-

## Stakeholders

-
`,
  )

  const contextDoc = okf(
    'architecture-section',
    `${template} context`,
    `# Context

<!-- System context — fill with evidence from code and interviews -->
`,
  )

  const spikeIndexTpl = okf(
    'architecture-spike',
    'SPK-NNN: [Title]',
    `# SPK-NNN: <Title>

| Field | Value |
|-------|-------|
| **ID** | SPK-NNN |
| **Track** | architecture \\| domain |
| **Type** | question \\| analysis \\| design |
| **Status** | draft |
| **Date** | YYYY-MM-DD |

## Goal

<What should be answered or designed?>

## Artifacts

| Kind | Path |
|------|------|
| Notes | [notes.md](./notes.md) |
| Boards | [boards/](./boards/) |
`,
  )

  const spikeNotesTpl = okf(
    'architecture-spike-notes',
    'Spike notes',
    `# Notes

## Working notes

-

## Diagrams

\`\`\`mermaid
flowchart LR
  A[Start] --> B[Explore]
\`\`\`
`,
  )

  return {
    'context/always-on.md': alwaysOn,
    'blueprint.md': blueprint,
    'entry-point.md': entry,
    'index.md': index,
    'log.md': log,
    'prompts/role-bootstrap.md': roleBootstrap,
    'prompts/role-maintenance.md': roleMaintenance,
    'prompts/role-review.md': roleReview,
    [`${template}/introduction.md`]: intro,
    [`${template}/context.md`]: contextDoc,
    [`${template}/README.md`]: okf(
      'architecture-index',
      `${template} template`,
      `# ${template}\n\nTemplate sections for ${name}. Expand via Continue sessions.\n`,
    ),
    'spikes/README.md': okf(
      'architecture-index',
      'Spikes',
      `# Spikes\n\nTimeboxed explorations (SPK register). Create via AGM Studio → Spike, or copy \`_template/\`.\n`,
    ),
    'spikes/_template/index.md': spikeIndexTpl,
    'spikes/_template/notes.md': spikeNotesTpl,
    'spikes/_template/boards/README.md': okf(
      'architecture-index',
      'Spike boards',
      `# Boards\n\nPlace \`.storm.json\` Event Storming boards here. Edit in AGM Studio or export to E2.\n`,
    ),
  }
}
