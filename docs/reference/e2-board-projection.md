# E2 board projection — Board Snapshot v2 → AGM domain graph

Procedure companion for workflow **`domain-board-ingest`**. Schema: [board-snapshot-v2](https://abx-git.github.io/E2/schemas/board-snapshot-v2.schema.json) (`format: event-storming-tool`, `version: 2`).

## Principles

| Rule | Rationale |
|------|-----------|
| **Provenance first** | Raw `.storm.json` lives under `sources/` — never lose the workshop artifact |
| **Project substance, not layout** | Drop viewport, coordinates, appearance, facilitator UI |
| **Filter, don't dump** | Tier + intent + centrality — not every sticky becomes a graph row |
| **Human gate** | Projection Manifest must be approved before domain graph writes |
| **Code wins conflicts** | Board is design/discovery truth; implementation evidence overrides silent overwrite |

## Substance vs noise

### Document (substances)

- Root: `title`, `glossary[]`, `exportedAt`, `views[]`
- Per view: `modelingMode`, `workshopFormat`, `elements[]`, `relations[]`, `boundedContexts[]`, `contextRelations[]`
- Element fields: `id`, `type`, `label`, `description`, `boundedContextId`, `metadata`
- Relation types: `triggers`, `reactsWith`, `informs`, `executedBy`, `invokes`, `causal`, `contains`
- Context map patterns on `contextRelations` (DDD strategic patterns)

### Discard for graph (noise)

- `x`, `y`, `width`, `height`, `rotation`, `viewport`, `snapToTimeline`, `snapToGrid`
- `appearance`, `workshopMode`, `activeViewId`, `facilitatorEnabled`, `facilitatorPhase`
- UI-only metadata: `noteColor`, `showDescriptionOnCard`, `showAttributesOnCard`, `showMethodsOnCard`
- Orphan `note` stickies (unless explicitly cited in the work report)

## Four filter layers

### 1. Intent filter (views)

Process only views whose `modelingMode` / `workshopFormat` match the session **Intent views**. Keep other views in the raw JSON; mark them `skip — out of intent` in the manifest.

| E2 `modelingMode` / format | Typical AGM targets |
|----------------------------|---------------------|
| `eventStorming` / `bigPicture`, `processModeling` | `domain/events.md`, discovery work report |
| `domainDrivenDesign` / `strategicDesign` | `domain/context-map.md`, `domain/subdomains.md` |
| `domainDrivenDesign` / `tacticalDesign`, `softwareDesign` | `domain/contexts/<bc>/model.md` |
| `bdd` / `exampleMapping` | Work item / `use-cases/` (acceptance) |
| `processFlow` | `use-cases/`, template `runtime.md` |
| `dataModel` | Hints in `model.md` / concepts — not sole persistence truth |
| `userStoryMapping` | Work item prioritization — rarely persistent domain graph |

### 2. Type priority (tiers)

**Tier A — always candidate when present**

`boundedContexts`, `contextRelations`, `domainEvent`, `pivotalEvent`, `command`, `aggregate`, `policy`, open `hotspot`, root `glossary`

**Tier B — when tactical / softwareDesign intent**

`entity`, `valueObject`, `domainService`, `repository`, `factory`, `readModel`, `externalSystem` (+ relevant `metadata`)

**Tier C — only with matching mode**

- BDD: `rule`, `example`
- Process: `processStart`, `processEnd`, `processActivity`, `processGateway`, `activity`, `userTask`
- Data: `dataEntity`, `dataAssociation`
- USM: `userStory`, `release`, `slice`

**Tier D — skip for graph**

`note` (default), layout fields, `link` (trace hint only)

### 3. Graph filter (centrality)

Prefer elements that:

- Sit on the timeline or have high `triggers` / `reactsWith` degree
- Are `pivotalEvent`, or aggregates with `aggregateInvariants`
- Have `boundedContextId` set (over orphans)
- Have `metadata.subdomainKind: core` over supporting/generic

### 4. Maturity filter

Include only when:

- Stable non-empty `id` and clear `label`
- No unresolved code conflict — or conflict is explicitly marked (open assumption)
- Open `hotspot` / `question` → Open Questions / risks, **not** stated as fact

## Projection Manifest template

Emit before any domain write:

| Element ID | Type | Label | Target file | Action | Reason |
|------------|------|-------|-------------|--------|--------|
| `evt-order-placed` | domainEvent | OrderPlaced | `domain/events.md` | create | Tier A · timeline |
| `agg-order` | aggregate | Order | `domain/contexts/order/model.md` | update | Tier A · invariants present |
| `note-1` | note | … | — | skip | Tier D |

Actions: `create` · `update` · `skip`

## Mapping table (board → AGM)

| Board material | AGM target |
|----------------|------------|
| `glossary[]` | `<template>/glossary.md`; optionally `domain/contexts/*/language.md` |
| `boundedContexts[]` + `contextRelations[]` | `domain/context-map.md` |
| `subdomain` + `subdomainKind` | `domain/subdomains.md` |
| `domainEvent` / `pivotalEvent` (+ `eventSchema`) | `domain/events.md` |
| `aggregate`, `entity`, `valueObject`, `repository`, `factory`, `domainService` | `domain/contexts/<slug>/model.md` |
| Timeline (`command` → `aggregate` → `domainEvent` → `policy`) | `work/YYYY-MM-DD-*-….md` (discovery sections) |
| Open `hotspot` / `question` | Work-item Open Questions; optional risks / guardrail rows |
| `externalSystem` | Candidate rows in `interfaces/imports.md` |
| `ui` / actors | Use-cases or context description |
| Process / USM / BDD (Tier C) | `use-cases/` or work item — domain graph only if Intent says so |
| `link` (`external` / `view`) | Traceability footnote only |

## Metadata worth copying

When projecting tactical elements, prefer these `metadata` keys into model tables:

| Key | Maps to |
|-----|---------|
| `aggregateInvariants` | Aggregate invariants column |
| `aggregateMethods` / `operations` | Methods / operations |
| `attributes` / `identityFields` | Entity / VO / data attributes |
| `eventSchema` | Event payload summary |
| `immutable` / `stateless` | VO / domain service notes |
| `aggregateRootRef` / `createsRef` | Repository / factory linkage |
| `ruleCriteria`, `exampleGiven`/`When`/`Then` | BDD acceptance (work / use-case) |
| `hotspotStatus` / `hotspotPriority` / `questionStatus` | Open questions triage |

## Source-ingest frontmatter (`e2-board-snapshot`)

```yaml
---
type: source-ingest
title: "<board title>"
description: "E2 board snapshot v2 ingest"
resource: "external://<source-label>"
tags: [ingest, e2-board-snapshot, domain]
timestamp: "YYYY-MM-DD"
provenance:
  sourceLabel: "<human label>"
  sourceType: e2-board-snapshot
  ingestedAt: "YYYY-MM-DD"
  confidentiality: internal | external | public
  originalUrl: "<optional>"
  schemaId: "https://abx-git.github.io/E2/schemas/board-snapshot-v2.schema.json"
  boardVersion: 2
  exportedAt: "<from snapshot>"
  rawBoard: "./YYYY-MM-DD-<slug>.storm.json"
  views:
    - id: "<view-id>"
      name: "<view-name>"
      modelingMode: "<mode>"
      workshopFormat: "<format>"
---
```

## Implementation documentation (what the board can and cannot do)

Boards document **intended domain design** (aggregates, commands, events, invariants, context cuts). They do **not** replace:

- Package / module paths (DDD-G02) — fill in AGM context-map / model **Implementation** fields
- Interface contracts — `interfaces/exports.md` / `imports.md`
- Code-evidenced structure — building blocks, runtime, ADRs

Recommended minimum board for implementation-oriented docs: strategic BC view + event-storm timeline + tactical aggregates with invariants + open hotspots for legacy tension.

## Related

- Workflow: [domain-board-ingest](../workflows/domain-board-ingest.md)
- Paste ingest: [content-ingest.md](./content-ingest.md)
- Report sections: [ddd-work-report-formats.md](./ddd-work-report-formats.md) § Board ingest
- Guardrails: [ddd-guardrails.md](./ddd-guardrails.md)
