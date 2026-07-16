# Architecture documentation areas

Human-selectable categories for **architecture content** in the Assistant (multi-select). IDs pass as `DOC_FOCUS` to `agm-install.sh` and into adoption / Evolve prompts.

## Agent-maintained graph (never selectable)

The human does **not** tick these. The agent creates and maintains them every session:

| File | Role |
|------|------|
| `entry-point.md` | Graph index — links to all content docs and sources |
| `blueprint.md` | Construction plan, phase status, session log |
| `context/always-on.md` | Session context, source code map |

When content areas change, the agent updates entry-point links and blueprint rows without the human selecting a special “area”.

`context/on-demand.md` is optional supplementary tables the agent fills when relevant areas are selected — not a separate human choice.

## Lifecycle

| Stage | What happens |
|-------|----------------|
| **Install** | Scaffold only |
| **Plan** | **Documentation focus:** checkboxes and/or optional free text |
| **Deepen** | Same checkboxes (synced) + optional text for this session → becomes `Scope` in prompt |
| **Adopt / Evolve** | Agent maintains graph files + selected content areas |

## Human-selectable categories

| ID | Label (UI) | Content (examples) |
|----|------------|-------------------|
| `implementation` | Software structure & implementation | Template building blocks / runtime; `work/` |
| `interfaces` | APIs & integration | `interfaces/exports.md`, `imports.md` |
| `persistence` | Data & storage | Template data sections |
| `security` | Security & compliance | Constraints, quality, risks |
| `deployment` | Deployment & environments | Template deployment, `ops/environments.md` |
| `observability` | Observability | Runtime notes, `ops/troubleshooting.md` |
| `operations` | Operations & incidents | `ops/` |
| `decisions` | Architecture decisions | `<template>/decisions/` ADRs |
| `domain-glossary` | Domain language & glossary | Glossary sections in template |
| `domain-model` | DDD strategic & tactical model | `domain/` (context map, contexts/, events) |
| `ecosystem` | Multi-service landscape | `ecosystem-index.md`, partner links |
| `external-sources` | External reference imports | `sources/` (Confluence, wikis, specs — provenance) |
| `use-cases` | Use cases & scenarios | `use-cases/`, introduction / runtime links |

Removed: `onboarding` (was entry-point — graph duty, not a content area).

**Content ingest:** workflow `content-ingest` (Evolve) — paste material in the Assistant UI; procedure in [content-ingest.md](./content-ingest.md).

Comma-separated: `implementation,interfaces,operations`
