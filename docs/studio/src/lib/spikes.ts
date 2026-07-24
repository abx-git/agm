import type { OkfMeta } from '../types'
import { parseFrontmatter } from './okf-parse'
import type { FileMap } from './fs-access'

export type SpikeTrack = 'architecture' | 'domain'
export type SpikeType =
  | 'question'
  | 'analysis'
  | 'design'
  | 'domain-question'
  | 'domain-discovery'
  | 'domain-analysis'
  | 'domain-design'

export interface SpikeInfo {
  /** Relative path of spike folder, e.g. process/spikes/2026-07-24-foo */
  path: string
  id: string
  title: string
  track: string
  type: string
  status: string
  date: string
}

export interface ReviewInfo {
  path: string
  id: string
  title: string
  verdict: string
  date: string
}

export interface CreateSpikeInput {
  title: string
  slug: string
  track: SpikeTrack
  type: SpikeType
  nextId: string
  date?: string
  author?: string
}

export interface CreateReviewInput {
  title: string
  slug: string
  nextId: string
  scope?: string
  date?: string
  author?: string
}

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function slugify(raw: string): string {
  return (
    raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'spike'
  )
}

function collectDirs(files: FileMap, segment: 'spikes' | 'reviews'): string[] {
  const dirs = new Set<string>()
  const reIndex = new RegExp(`(^|.*/)(${segment}/[^/]+)/index\\.md$`, 'i')
  const reAny = new RegExp(`(^|.*/)(${segment}/[^/]+)/`)
  for (const path of files.keys()) {
    const m = path.match(reIndex)
    if (m?.[2]) {
      const prefix = m[1] || ''
      dirs.add(`${prefix}${m[2]}`.replace(/^\//, ''))
    }
    const m2 = path.match(reAny)
    if (m2?.[2]) {
      const prefix = m2[1] || ''
      dirs.add(`${prefix}${m2[2]}`.replace(/^\//, ''))
    }
  }
  return [...dirs]
}

/** List spike folders (process/spikes preferred; legacy top-level spikes/ also). */
export function listSpikes(files: FileMap): SpikeInfo[] {
  const dirs = collectDirs(files, 'spikes')
  const spikes: SpikeInfo[] = []
  for (const dir of dirs) {
    if (dir.includes('/_template') || dir.endsWith('/_template')) continue
    const indexPath = `${dir}/index.md`
    const content = files.get(indexPath)
    if (!content) continue
    const { meta, body } = parseFrontmatter(content)
    const idMatch =
      body.match(/\*\*ID\*\*\s*\|\s*(SPK-\d+|WRK-\d+)/i) || content.match(/SPK-\d+|WRK-\d+/)
    const info: SpikeInfo = {
      path: dir,
      id: idMatch?.[1] || idMatch?.[0] || 'SPK-???',
      title: String((meta as OkfMeta | null)?.title || dir.split('/').pop() || dir),
      track: String((meta as OkfMeta | null)?.track || ''),
      type: String((meta as OkfMeta | null)?.type || 'architecture-spike'),
      status: 'draft',
      date: dir.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '',
    }
    const st = body.match(/\*\*Status\*\*\s*\|\s*(\w+)/i)
    if (st) info.status = st[1]!
    const tr = body.match(/\*\*Track\*\*\s*\|\s*(\w+)/i)
    if (tr) info.track = tr[1]!
    const ty = body.match(/\*\*Type\*\*\s*\|\s*([^|\n]+)/i)
    if (ty) info.type = ty[1]!.trim()
    spikes.push(info)
  }
  return spikes.sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
}

/** List review folders under process/reviews/ (and any …/reviews/). */
export function listReviews(files: FileMap): ReviewInfo[] {
  const dirs = collectDirs(files, 'reviews')
  const reviews: ReviewInfo[] = []
  for (const dir of dirs) {
    if (dir.includes('/_template') || dir.endsWith('/_template')) continue
    const indexPath = `${dir}/index.md`
    const content = files.get(indexPath)
    if (!content) continue
    const { meta, body } = parseFrontmatter(content)
    const idMatch = body.match(/\*\*ID\*\*\s*\|\s*(REV-\d+)/i) || content.match(/REV-\d+/)
    const verdict =
      body.match(/\*\*Verdict\*\*\s*\|\s*([^|\n]+)/i)?.[1]?.trim() ||
      body.match(/`?(PASS(?: WITH NOTES)?|FAIL)`?/i)?.[1] ||
      ''
    reviews.push({
      path: dir,
      id: idMatch?.[1] || idMatch?.[0] || 'REV-???',
      title: String((meta as OkfMeta | null)?.title || dir.split('/').pop() || dir),
      verdict,
      date: dir.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '',
    })
  }
  return reviews.sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
}

export function nextSpikeId(blueprintText: string | undefined, spikes: SpikeInfo[]): string {
  let max = 0
  const re = /SPK-(\d+)/gi
  const scan = (text: string) => {
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      max = Math.max(max, parseInt(m[1]!, 10))
    }
  }
  if (blueprintText) scan(blueprintText)
  for (const s of spikes) scan(s.id)
  return `SPK-${String(max + 1).padStart(3, '0')}`
}

export function nextReviewId(blueprintText: string | undefined, reviews: ReviewInfo[]): string {
  let max = 0
  const re = /REV-(\d+)/gi
  const scan = (text: string) => {
    let m: RegExpExecArray | null
    while ((m = re.exec(text))) {
      max = Math.max(max, parseInt(m[1]!, 10))
    }
  }
  if (blueprintText) scan(blueprintText)
  for (const r of reviews) scan(r.id)
  return `REV-${String(max + 1).padStart(3, '0')}`
}

export function buildSpikeFiles(input: CreateSpikeInput): Record<string, string> {
  const date = input.date || today()
  const folder = `process/spikes/${date}-${input.slug}`
  const ts = today()
  const title = `${input.nextId}: ${input.title}`

  const index = `---
type: architecture-spike
title: "${title.replace(/"/g, '\\"')}"
description: "Architecture/domain spike"
resource: "repo://"
tags: [architecture, spike]
timestamp: "${ts}"
track: ${input.track}
---

# ${title}

| Field | Value |
|-------|-------|
| **ID** | ${input.nextId} |
| **Track** | ${input.track} |
| **Type** | ${input.type} |
| **Status** | draft |
| **Date** | ${date} |
| **Author** | ${input.author || 'AGM Studio'} |

## Goal

${input.title}

## Context

- [entry-point.md](../../../entry-point.md)
- [blueprint.md](../../../blueprint.md)

## Artifacts in this spike

| Kind | Path |
|------|------|
| Notes | [notes.md](./notes.md) |
| Boards | [boards/](./boards/) |

## Outcome / links into the graph

<!-- Promote durable findings into template sections. -->
`

  const notes = `---
type: architecture-spike-notes
title: "Spike notes — ${input.title.replace(/"/g, '\\"')}"
description: ""
resource: "repo://"
tags: [architecture, spike]
timestamp: "${ts}"
---

# Notes

## Findings

-

## Diagrams

\`\`\`mermaid
flowchart LR
  start[Start] --> explore[Explore]
\`\`\`

## Board references

-

## Open questions

-
`

  return {
    [`${folder}/index.md`]: index,
    [`${folder}/notes.md`]: notes,
    [`${folder}/boards/README.md`]: `---
type: architecture-index
title: "Spike boards"
description: "E2 .storm.json boards for this spike"
resource: "repo://"
tags: [architecture, spike, board]
timestamp: "${ts}"
---

# Boards

E2 \`*.storm.json\` boards for this spike.
`,
  }
}

export function buildReviewFiles(input: CreateReviewInput): Record<string, string> {
  const date = input.date || today()
  const folder = `process/reviews/${date}-${input.slug}`
  const ts = today()
  const title = `${input.nextId}: ${input.title}`
  const scope = input.scope || 'phase'

  const index = `---
type: architecture-review
title: "${title.replace(/"/g, '\\"')}"
description: "Verify review — report only"
resource: "repo://"
tags: [architecture, review]
timestamp: "${ts}"
---

# ${title}

| Field | Value |
|-------|-------|
| **ID** | ${input.nextId} |
| **Scope** | ${scope} |
| **Target** | |
| **Verdict** | |
| **Date** | ${date} |
| **Author** | ${input.author || 'AGM Studio'} |

## Artifacts

| Kind | Path |
|------|------|
| Report | [report.md](./report.md) |
| Findings | [findings.md](./findings.md) |
`

  const report = `---
type: architecture-review-report
title: "Review report — ${input.title.replace(/"/g, '\\"')}"
description: ""
resource: "repo://"
tags: [architecture, review]
timestamp: "${ts}"
---

# Report

## Scope

-

## Verdict

\`PASS\` | \`PASS WITH NOTES\` | \`FAIL\`

## Summary

-

## Top risks

-
`

  const findings = `---
type: architecture-review-findings
title: "Review findings — ${input.title.replace(/"/g, '\\"')}"
description: ""
resource: "repo://"
tags: [architecture, review]
timestamp: "${ts}"
---

# Findings

| ID | Severity | Finding | Evidence | Recommendation |
|----|----------|---------|----------|----------------|
| F-001 | | | | |
`

  return {
    [`${folder}/index.md`]: index,
    [`${folder}/report.md`]: report,
    [`${folder}/findings.md`]: findings,
  }
}

export function appendSpikeRegisterRow(
  blueprint: string,
  row: { id: string; track: string; title: string; type: string; path: string; status: string; date: string },
): string {
  const line = `| ${row.id} | ${row.track} | ${row.title} | ${row.type} | ${row.path}/ | ${row.status} | ${row.date} |`
  if (/## Spike register/i.test(blueprint)) {
    return blueprint.replace(/(## Spike register[\s\S]*?\n\|[-| ]+\|\n)/i, `$1${line}\n`)
  }
  if (/## Work register/i.test(blueprint)) {
    return blueprint.replace(/(## Work register[\s\S]*?\n\|[-| ]+\|\n)/i, `$1${line}\n`)
  }
  return (
    blueprint.trimEnd() +
    `\n\n## Spike register\n\n| ID | Track | Title | Type | Path | Status | Date |\n|----|-------|-------|------|------|--------|------|\n${line}\n`
  )
}

export function appendReviewRegisterRow(
  blueprint: string,
  row: {
    id: string
    target: string
    reviewed: string
    verdict: string
    reportPath: string
    findingsPath: string
  },
): string {
  const line = `| ${row.id} | ${row.target} | ${row.reviewed} | ${row.verdict} | ${row.reportPath} | ${row.findingsPath} |`
  if (/## Reviews/i.test(blueprint)) {
    // Prefer table with ID column if present; else insert after separator of first reviews table
    if (/## Reviews[\s\S]*?\n\| ID \|/i.test(blueprint)) {
      return blueprint.replace(/(## Reviews[\s\S]*?\n\|[-| ]+\|\n)/i, `$1${line}\n`)
    }
    return blueprint.replace(
      /(## Reviews[\s\S]*?\n\|[-| ]+\|\n)/i,
      `$1${line}\n`,
    )
  }
  return (
    blueprint.trimEnd() +
    `\n\n## Reviews\n\n| ID | Phase / target | Reviewed | Verdict | Report | Findings |\n|----|----------------|----------|---------|--------|----------|\n${line}\n`
  )
}

export function emptyStormBoard(title: string, modelingMode = 'eventStorming'): string {
  const viewId = 'view-1'
  return JSON.stringify(
    {
      $schema: 'https://abx-git.github.io/E2/schemas/board-snapshot-v2.schema.json',
      format: 'event-storming-tool',
      version: 2,
      exportedAt: new Date().toISOString(),
      title,
      glossary: [],
      workshopMode: false,
      activeViewId: viewId,
      views: [
        {
          id: viewId,
          name: 'Board',
          modelingMode,
          workshopFormat: 'free',
          facilitatorEnabled: false,
          facilitatorPhase: 0,
          elements: [],
          relations: [],
          contextRelations: [],
          swimlanes: [],
          boundedContexts: [],
          timeline: { y: 400, startLabel: 'Start', endLabel: 'End', visible: true },
          viewport: { x: 0, y: 0, zoom: 1 },
          snapToTimeline: true,
          snapToGrid: false,
        },
      ],
    },
    null,
    2,
  )
}
