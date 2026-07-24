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
  /** Relative path of spike folder, e.g. spikes/2026-07-24-foo */
  path: string
  id: string
  title: string
  track: string
  type: string
  status: string
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

function today(): string {
  return new Date().toISOString().slice(0, 10)
}

export function slugify(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'spike'
}

/** List spike folders that contain index.md under spikes/. */
export function listSpikes(files: FileMap): SpikeInfo[] {
  const dirs = new Set<string>()
  for (const path of files.keys()) {
    const m = path.match(/^(.*(?:^|\/)spikes\/[^/]+)\//)
    if (m?.[1]) dirs.add(m[1].replace(/^\//, ''))
    // also spikes/foo/index.md
    const m2 = path.match(/^(spikes\/[^/]+)\/index\.md$/i)
    if (m2?.[1]) dirs.add(m2[1])
    const m3 = path.match(/^(.+\/spikes\/[^/]+)\/index\.md$/i)
    if (m3?.[1]) dirs.add(m3[1])
  }

  const spikes: SpikeInfo[] = []
  for (const dir of dirs) {
    if (dir.includes('/_template') || dir.endsWith('/_template')) continue
    const indexPath = `${dir}/index.md`
    const content = files.get(indexPath)
    if (!content) continue
    const { meta, body } = parseFrontmatter(content)
    const idMatch = body.match(/\*\*ID\*\*\s*\|\s*(SPK-\d+|WRK-\d+)/i) || content.match(/SPK-\d+|WRK-\d+/)
    spikes.push({
      path: dir,
      id: idMatch?.[1] || idMatch?.[0] || 'SPK-???',
      title: String((meta as OkfMeta | null)?.title || dir.split('/').pop() || dir),
      track: String((meta as OkfMeta | null)?.track || ''),
      type: String((meta as OkfMeta | null)?.type || 'architecture-spike'),
      status: 'draft',
      date: dir.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '',
    })
    // enrich status from table if present
    const st = body.match(/\*\*Status\*\*\s*\|\s*(\w+)/i)
    if (st) spikes[spikes.length - 1]!.status = st[1]!
    const tr = body.match(/\*\*Track\*\*\s*\|\s*(\w+)/i)
    if (tr) spikes[spikes.length - 1]!.track = tr[1]!
    const ty = body.match(/\*\*Type\*\*\s*\|\s*([^|\n]+)/i)
    if (ty) spikes[spikes.length - 1]!.type = ty[1]!.trim()
  }
  return spikes.sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
}

/** Next SPK-NNN from blueprint.md content or existing spikes. */
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

export function buildSpikeFiles(input: CreateSpikeInput): Record<string, string> {
  const date = input.date || today()
  const folder = `spikes/${date}-${input.slug}`
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

- [entry-point.md](../../entry-point.md)
- [blueprint.md](../../blueprint.md)

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

  const boardsReadme = `# Boards

E2 \`*.storm.json\` boards for this spike. Edit in AGM Studio or export/import from E2.
`

  return {
    [`${folder}/index.md`]: index,
    [`${folder}/notes.md`]: notes,
    [`${folder}/boards/README.md`]: boardsReadme,
  }
}

/** Append a row to ## Spike register (or create section). Also accepts legacy Work register. */
export function appendSpikeRegisterRow(
  blueprint: string,
  row: { id: string; track: string; title: string; type: string; path: string; status: string; date: string },
): string {
  const line = `| ${row.id} | ${row.track} | ${row.title} | ${row.type} | ${row.path}/ | ${row.status} | ${row.date} |`
  if (/## Spike register/i.test(blueprint)) {
    // Insert after header separator row
    return blueprint.replace(
      /(## Spike register[\s\S]*?\n\|[-| ]+\|\n)/i,
      `$1${line}\n`,
    )
  }
  if (/## Work register/i.test(blueprint)) {
    return blueprint.replace(
      /(## Work register[\s\S]*?\n\|[-| ]+\|\n)/i,
      `$1${line}\n`,
    )
  }
  // Append new section
  return (
    blueprint.trimEnd() +
    `\n\n## Spike register\n\n| ID | Track | Title | Type | Path | Status | Date |\n|----|-------|-------|------|------|--------|------|\n${line}\n`
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
