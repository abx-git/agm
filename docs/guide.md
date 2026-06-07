# Architecture Graph Method (AGM) — Guide

Architecture documentation as a **Markdown link graph** in `docs/architecture/`, maintained with AI agents, versioned in Git. No RAG, no external wiki.

**Sample app:** [examples/sample-app](./examples/sample-app/) · **Dialogs:** [typical-dialog.md](./typical-dialog.md) · **Assistant:** [abx-git.github.io/blueprint-pattern.github.io](https://abx-git.github.io/blueprint-pattern.github.io/) — [Pages setup](./assistant/GITHUB-PAGES-SETUP.md)

---

## Lifecycle (four phases)

| Phase | Goal | Typical workflows | Lead file |
|-------|------|-------------------|-----------|
| **1 · Build** | Create the doc graph iteratively | `bootstrap-adopt`, `bootstrap-continue`, `review-milestone` | **`blueprint.md`** — construction plan: phase → target file |
| **2 · Evolve** | Deepen or sync docs with code | `refinement`, `maintenance` (+ `git diff`) | Graph + **`entry-point.md`**; agent updates **`blueprint.md`** |
| **3 · Work (Architecture)** | Technical architecture on the graph | `architecture-work-query`, `-analysis`, `-design`, `-continue` | **`work/`** + WRK (Track: architecture) |
| **4 · Work (Domain / DDD)** | Strategic & tactical domain model | `domain-work-event-storm`, `-context-map`, `-tactical-review`, … | **`domain/`** + **`work/`** + WRK (Track: domain) |

**Review** (`review-phase`, `review-milestone`, `review-maintenance`) applies in all phases — report-only, always a **new chat**.

---

## Terms (read once)

| Term | Meaning |
|------|---------|
| **Graph** | Linked docs: `entry-point.md`, template folders (e.g. `arc42/`), `domain/`, `interfaces/`, `work/`, `ops/` |
| **`always-on.md`** | Stable session context: app identity, stack, source map — read every session |
| **`blueprint.md`** | **Construction plan** for the doc graph: phase → target file, status, WRK, reviews, session log — not architecture body text |
| **`entry-point.md`** | **Agent graph index:** linked map to all architecture docs and source paths (workflows traverse from here); optional short overview for humans — **no** phase status or session log |
| **Architecture Graph Method (AGM)** | The whole method: graph + lifecycle + agent rules |
| **Blueprint** | The steering artefact `blueprint.md`: construction plan, WRK register, reviews, session log |
| **Blueprint Pattern** | Legacy alias for AGM (same method; repository name unchanged) |
| **Core prompt** | Permanent agent behavior → [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) |
| **Session prompt** | This chat’s task — paste from [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) or [prompts/workflows/](../prompts/workflows/) |
| **Role** | Step-by-step procedure → `docs/architecture/prompts/role-*.md` |

```text
Core rules (once) + session prompt (per chat) → agent → docs/architecture/ → update blueprint.md
```

---

## Day to day: three things

| # | What | Where |
|---|------|-------|
| 1 | Agent rules | `prompts/core/system-prompt.md` in IDE rules |
| 2 | Architecture content | `docs/architecture/` in your app repo |
| 3 | Current task | Copy session prompt (Assistant UI or `prompts/workflows/<id>.md`) → new chat |

---

## Operations by lifecycle phase

### 1 · Build

| Goal | Workflow | New chat |
|------|----------|----------|
| Install prompts + scaffold | Assistant UI → copy `bp-install.sh` → run in app repo | — |
| Adopt pattern | Assistant UI → `bootstrap-adopt` or [adopt-standalone](../prompts/adopt-standalone.md) | Yes |
| Continue next blueprint phase | `bootstrap-continue` | Yes |
| Close build phase | `review-milestone` | **Required** |

### 2 · Evolve

| Goal | Workflow | New chat |
|------|----------|----------|
| Deepen one section | `refinement` | Yes |
| After code change (paste diff) | `maintenance` | Yes |
| After code change (git range) | `maintenance-diff-range` — agent runs `git diff` / Git MCP; [pipeline](../prompts/reference/maintenance-pipeline.md) | Yes |

### 3 · Work (Architecture)

| Goal | Workflow | New chat |
|------|----------|----------|
| Answer question | `architecture-work-query` | Yes |
| Dialog — explore solution | `architecture-work-interrogate` | Yes — Cursor **Chat** |
| Analysis | `architecture-work-analysis` | Yes |
| Sustainable analysis | `architecture-work-sustainable-analysis` | Yes |
| Sustainable analysis (dialog) | `architecture-work-sustainable-interrogate` | Yes — Cursor **Chat** |
| Design proposal | `architecture-work-design` | Yes |
| Open WRK items (architecture) | `architecture-work-continue` | Yes |

### 4 · Work (Domain / DDD)

| Goal | Workflow | New chat |
|------|----------|----------|
| Event Storming (dialog) | `domain-work-event-storm` | Yes — Cursor **Chat** |
| Context map | `domain-work-context-map` | Yes |
| Subdomain classification | `domain-work-subdomain-classification` | Yes |
| Integration review | `domain-work-integration-review` | Yes |
| Tactical review (aggregates) | `domain-work-tactical-review` | Yes |
| Ubiquitous language audit | `domain-work-language-audit` | Yes |
| Domain question | `domain-work-query` | Yes |
| Domain design | `domain-work-design` | Yes |
| Open WRK items (domain) | `domain-work-continue` | Yes |

Reference: [ddd-work-report-formats](../prompts/reference/ddd-work-report-formats.md) · [ddd-guardrails](../prompts/reference/ddd-guardrails.md)

### Review (all phases)

| Goal | Workflow | New chat |
|------|----------|----------|
| Verify one phase | `review-phase` | **Required** |
| Verify after maintenance | `review-maintenance` | **Required** |

Session prompt source files: [prompts/workflows/](../prompts/workflows/). Copy the session block into a new chat — no checkout script in application repos.

*(Optional in this pattern repository only: `./scripts/bp-workflow.sh checkout <id>` writes `ACTIVE.md` for Cursor rule integration.)*

---

## Setup (once, ~30 min)

**Recommended — Assistant UI (Build tab):**

1. **Install** — choose OS, AI tool, project name, documentation template, and doc root → copy the generated script → run at your application repository root (`bp-install.sh`). Downloads prompts and scaffold via HTTPS — **no git clone** of blueprint-pattern.
2. **Adopt** — copy the adoption prompt → new chat. The agent creates **`blueprint.md`**, **`entry-point.md`**, configures **`always-on.md`**, and the first evidence-based section.

Alternatively: [prompts/adopt-standalone.md](../prompts/adopt-standalone.md) after running [scripts/bp-install.sh](../scripts/bp-install.sh) manually.

After scaffold exists, copy session prompts per lifecycle phase (UI substitutes your doc root and installed `prompts/workflows/` paths). Enable [CI link check](../prompts/reference/ci-integrity.md) on the app repo.

**Template** (record in `entry-point.md`): `arc42` (default) · `c4-light` · `adr-first` · `lean-service` · `custom`.

---

## Every session

1. Copy session prompt for `<workflow>`
2. New chat (never review in the write chat)
3. Confirm `blueprint.md` and changed docs at the end

**Compaction:** after long sessions (≥2 phases, ≥15 files, ≥30 turns), start a new chat; resume using the session log in `blueprint.md`.

---

## App layout

```
docs/architecture/
├── blueprint.md      ← construction plan + session state
├── entry-point.md    ← human entry + navigation + source links
├── context/          ← always-on.md, on-demand.md
├── prompts/          ← role-*.md (from templates)
├── work/             ← architecture + domain work items, review reports
├── domain/           ← context map, subdomains, events, contexts/*/ (DDD)
├── interfaces/       ← exports.md, imports.md
├── ops/              ← runbooks, pitfalls (when needed)
└── arc42/            ← or c4-light/, adr-first/, lean-service/
```

Work (phases 3–4): traverse **links first**; write `work/YYYY-MM-DD-<slug>.md`; register `WRK-NNN` in `blueprint.md` ## Work register with **Track** `architecture` or `domain`; link to template and `domain/` sections, do not duplicate.

---

## Mechanisms (built into AGM)

| Mechanism | Purpose |
|-----------|---------|
| `always-on.md` | Stable app facts every session |
| `blueprint.md` | Construction plan + progress across sessions |
| `entry-point.md` | Human-readable entry and navigation |
| Roles | Same steps per operation family; workflows vary the task |
| Review (fresh chat, report-only) | Separate generation from verification |
| `domain/` | DDD: context map, subdomains, events, per-context model & language |
| `ops/` | Runbooks and pitfalls beside arc42 |
| Semantic anchors | Session checklist (`[[ANCHOR:LINK_CHECK]]`, …) |
| CI link check | Broken relative links fail in PR |

---

## Further reading (optional)

| Document | When |
|----------|------|
| [Typical dialog](./typical-dialog.md) | Sample sessions; core vs. workflow vs. role |
| [Gen AI challenges](./gen-ai-challenges.md) | Governance, LLM limits, org vs. not solvable |
| [Architects article](./article/blueprint-pattern-for-architects.md) | Principles and comparison |
| [Migration from arc42-only wording](./migration-arc42-only.md) | Existing doc renames |
| [Blueprint format](../prompts/reference/blueprint-format.md) | `blueprint.md` schema |
| [DDD report formats](../prompts/reference/ddd-work-report-formats.md) | Domain Work output structure |
| [DDD guardrails](../prompts/reference/ddd-guardrails.md) | Domain smell catalog |

---

**One-liner:** Build the graph → evolve it → architecture work (technical) + domain work (DDD) — one session prompt per chat.
