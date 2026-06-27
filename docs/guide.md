# Architecture Graph Method (AGM) — Guide

Architecture documentation as a **Markdown link graph** in `docs/architecture/`, maintained with AI agents, versioned in Git. No RAG, no external wiki.

**Sample app:** [examples/sample-app](./examples/sample-app/) · **Dialogs:** [typical-dialog.md](./typical-dialog.md) · **Assistant:** [abx-git.github.io/blueprint-pattern.github.io](https://abx-git.github.io/blueprint-pattern.github.io/) — [Pages setup](./assistant/GITHUB-PAGES-SETUP.md)

---

## Two orthogonal views

AGM separates **when the doc graph is mature** from **what kind of architecture work you do**.

| View | Question | Vocabulary |
|------|----------|------------|
| **Graph lifecycle** | How complete is the documentation graph? | Build → Evolve → Architect / Domain work |
| **Architecture activities** | What are you doing as an architect? | Clarify → Design → Evaluate → Communicate → Sync |

Both apply in every project. A team in **Evolve** can still run **Architect · Design**; a **Build** session often produces **Communicate** artefacts (template chapters).

```text
Graph lifecycle (maturity)     Architecture activities (intent)
─────────────────────────     ─────────────────────────────────
Build                         Clarify · Communicate
Evolve                        Communicate · Sync
Architect / Domain work       Clarify · Design · Evaluate
Verify (all stages)           Evaluate
```

---

## Graph lifecycle (four stages)

| Stage | Goal | Lead file | Typical tracks |
|-------|------|-----------|----------------|
| **1 · Build** | Create the doc graph iteratively | **`blueprint.md`** — construction plan: phase → target file | Build |
| **2 · Evolve** | Deepen chapters or sync docs with code | Graph + **`entry-point.md`**; agent updates **`blueprint.md`** | Evolve |
| **3 · Architect** | Technical architecture on the graph | **`work/`** + WRK (Track: architecture) | Architect |
| **4 · Domain** | Strategic & tactical domain model (DDD) | **`domain/`** + **`work/`** + WRK (Track: domain) | Domain |

**Verify** (`review-*`) applies in all stages — report-only, always a **new chat**.

Legacy workflow IDs (`bootstrap-*`, `architecture-work-*`, `domain-work-*`, `review-*`) are unchanged; session prompts use the unified **Track · Activity** header (see below).

---

## Architecture activities (six phases)

Classic architecture work phases map to AGM **activities**, artefacts, and workflows — not to a separate lifecycle.

| Activity | Typical intent | Primary artefacts | Workflows (examples) |
|----------|----------------|-------------------|----------------------|
| **Clarify** | Requirements, constraints, scope, domain discovery | `introduction.md`, `constraints.md`, `quality.md`, `domain/`, `work/` (question) | Architect · Clarify, Domain · Clarify |
| **Design** | Structures, views, cross-cutting concepts, boundaries | `building-blocks.md`, `runtime.md`, `concepts.md`, `domain/context-map.md`, `work/` (design) | Architect · Design, Domain · Design |
| **Evaluate** | Assess quality, risks, drift, DDD smells | `work/` (analysis), `work/*-review*`, Reviews + Guardrails in `blueprint.md` | Architect · Evaluate, Domain · Evaluate, Verify · Evaluate |
| **Communicate** | Make architecture legible to a audience | `entry-point.md`, template views, `ops/` | Build · Communicate, Evolve · Refine |
| **Sync** | Keep docs aligned with implementation | Diff-driven updates, `interfaces/`, drift reports | Evolve · Sync |
| **Continue** | Resume open work | WRK register in `blueprint.md` | Architect · Continue, Domain · Continue |

Activities are **iterative**, not a waterfall. Example (payment resilience): Clarify (query) → Evaluate (analysis) → Design (circuit breaker) → Verify (phase review) → Communicate (refine runtime view) → Sync (maintenance after merge).

Optional WRK metadata: tag work items with an activity (`clarify`, `design`, …) in the title or a future `Activity` column for filtering in **Continue** sessions.

---

## Workflow vocabulary

Every session prompt is described with three fields (see table in each [prompts/workflows/](../prompts/workflows/) file):

| Field | Values | Meaning |
|-------|--------|---------|
| **Track** | `Build` · `Evolve` · `Architect` · `Domain` · `Verify` | Which part of the method this session belongs to |
| **Activity** | `Clarify` · `Design` · `Evaluate` · `Communicate` · `Sync` · `Continue` | What kind of architecture work |
| **Mode** | `Direct` · `Dialog` | **Direct** — agent writes in one session. **Dialog** — interview first (one question per reply); write only after explicit human signal |

Session prompt header format:

```text
AGM — <Track> · <Activity>[(variant)]
Workflow: <workflow-id>
Role: <role-id>
```

Examples: `AGM — Architect · Clarify` · `AGM — Evolve · Sync (git range)` · `AGM — Domain · Clarify (dialog)`

### Track → role

| Track | Role file | Workflow ID prefix (legacy) |
|-------|-----------|----------------------------|
| Build | `role-bootstrap.md` | `bootstrap-*` |
| Evolve | `role-bootstrap.md` or `role-maintenance.md` | `refinement`, `maintenance*` |
| Architect | `role-architecture-work.md` | `architecture-work-*` |
| Domain | `role-domain-work.md` | `domain-work-*` |
| Verify | `role-review.md` | `review-*` |

Several workflows share one **role** when the procedure matches but the activity differs (`bootstrap-continue` and `refinement` both use `role-bootstrap`).

### Interaction patterns

| Pattern | When | Mode | End signal |
|---------|------|------|------------|
| **Graph traverse → artefact** | Evidence exists in the graph | Direct | Session ends with WRK + anchors |
| **Dialog → write** | Requirements or scope unclear | Dialog | Human: „end interview“, „done“, „write it up“ |
| **Diff → sync → verify** | Code changed | Direct + Verify chat | `maintenance*` then `review-maintenance` |

---

## Terms (read once)

| Term | Meaning |
|------|---------|
| **Graph** | Linked docs: `entry-point.md`, template folders (e.g. `arc42/`), `domain/`, `interfaces/`, `work/`, `ops/` |
| **`always-on.md`** | Stable session context: app identity, stack, source map — read every session |
| **`blueprint.md`** | **Construction plan** for the doc graph: phase → target file, status, WRK, reviews, session log — not architecture body text |
| **`entry-point.md`** | **Agent graph index:** linked map to all architecture docs and source paths (workflows traverse from here); optional short overview for humans — **no** phase status or session log |
| **Track** | Workflow family: Build, Evolve, Architect, Domain, Verify |
| **Activity** | Architecture intent: Clarify, Design, Evaluate, Communicate, Sync, Continue |
| **Architecture Graph Method (AGM)** | The whole method: graph + lifecycle + activities + agent rules |
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

## Workflows by track

### Build

| Activity | Goal | Workflow ID | Mode | New chat |
|----------|------|-------------|------|----------|
| — | Install prompts + scaffold | Assistant UI → `bp-install.sh` | — | — |
| Communicate | Adopt pattern (first time) | `bootstrap-adopt` | Direct | Yes |
| Communicate | Bootstrap scaffold | `bootstrap-init` | Direct | Recommended |
| Communicate | Next blueprint chapter | `bootstrap-continue` | Direct | Yes |
| Evaluate | Close build stage | `review-milestone` | Direct | **Required** |

Adoption alternative: [adopt-standalone](../prompts/adopt-standalone.md)

### Evolve

| Activity | Goal | Workflow ID | Mode | New chat |
|----------|------|-------------|------|----------|
| Communicate | Deepen one section / audience | `refinement` | Direct | Yes |
| Sync | After code change (paste diff) | `maintenance` | Direct | Yes |
| Sync | After code change (git range) | `maintenance-diff-range` | Direct | Yes |

Pipeline: [maintenance-pipeline](../prompts/reference/maintenance-pipeline.md)

### Architect

| Activity | Goal | Workflow ID | Mode | New chat |
|----------|------|-------------|------|----------|
| Clarify | Answer using the graph | `architecture-work-query` | Direct | Yes |
| Clarify | Explore solution step by step | `architecture-work-interrogate` | Dialog | Yes — Cursor **Chat** |
| Evaluate | Risks, coupling, quality | `architecture-work-analysis` | Direct | Yes |
| Evaluate | Structure, drift, tech debt | `architecture-work-sustainable-analysis` | Direct | Yes |
| Evaluate | Scope sustainable analysis (dialog) | `architecture-work-sustainable-interrogate` | Dialog | Yes — Cursor **Chat** |
| Design | Structure or cross-cutting proposal | `architecture-work-design` | Direct | Yes |
| Continue | Open WRK (Track: architecture) | `architecture-work-continue` | Direct | Yes |

### Domain

| Activity | Goal | Workflow ID | Mode | New chat |
|----------|------|-------------|------|----------|
| Clarify | Domain discovery | `domain-work-event-storm` | Dialog | Yes — Cursor **Chat** |
| Clarify | Subdomain investment map | `domain-work-subdomain-classification` | Direct | Yes |
| Clarify | Answer domain question | `domain-work-query` | Direct | Yes |
| Design | Context map | `domain-work-context-map` | Direct | Yes |
| Design | Model / boundary design | `domain-work-design` | Direct | Yes |
| Evaluate | Integration patterns | `domain-work-integration-review` | Direct | Yes |
| Evaluate | Aggregates, invariants | `domain-work-tactical-review` | Direct | Yes |
| Evaluate | Ubiquitous language | `domain-work-language-audit` | Direct | Yes |
| Continue | Open WRK (Track: domain) | `domain-work-continue` | Direct | Yes |

Reference: [ddd-work-report-formats](../prompts/reference/ddd-work-report-formats.md) · [ddd-guardrails](../prompts/reference/ddd-guardrails.md)

### Verify (all stages)

| Activity | Goal | Workflow ID | Mode | New chat |
|----------|------|-------------|------|----------|
| Evaluate | Verify one blueprint phase | `review-phase` | Direct | **Required** |
| Evaluate | Verify after maintenance | `review-maintenance` | Direct | **Required** |

Report-only — never in the same chat as the write/sync session.

Session prompt files: [prompts/workflows/](../prompts/workflows/). Copy the session block into a new chat.

*(Optional in this pattern repository only: `./scripts/bp-workflow.sh checkout <id>` writes `ACTIVE.md` for Cursor rule integration.)*

---

## Quick picker: activity → workflow

| I need to… | Start with |
|------------|------------|
| Clarify requirements or constraints | `architecture-work-interrogate` or `bootstrap-continue` (chapters 1–3) |
| Design structure or views | `architecture-work-design` |
| Design cross-cutting concepts | `architecture-work-design` (note scope: concepts) + `refinement` on `concepts.md` |
| Evaluate an architecture | `architecture-work-analysis` or `review-phase` |
| Communicate to stakeholders | `refinement` or `bootstrap-continue` (target view) |
| Monitor implementation / drift | `maintenance-diff-range` or `architecture-work-sustainable-analysis` |
| Domain discovery | `domain-work-event-storm` |
| Resume unfinished work | `architecture-work-continue` or `domain-work-continue` |

---

## Setup (once, ~30 min)

**Recommended — Assistant UI (Build tab):**

1. **Install** — choose OS, AI tool, project name, documentation template, and doc root → copy the generated script → run at your application repository root (`bp-install.sh`). Downloads prompts and scaffold via HTTPS — **no git clone** of blueprint-pattern.
2. **Adopt** — copy the adoption prompt → new chat. The agent creates **`blueprint.md`**, **`entry-point.md`**, configures **`always-on.md`**, and the first evidence-based section.

Alternatively: [prompts/adopt-standalone.md](../prompts/adopt-standalone.md) after running [scripts/bp-install.sh](../scripts/bp-install.sh) manually.

After scaffold exists, copy session prompts per track (UI substitutes your doc root and installed `prompts/workflows/` paths). Enable [CI link check](../prompts/reference/ci-integrity.md) on the app repo.

**Template** (record in `entry-point.md`): `arc42` (default) · `c4-light` · `adr-first` · `lean-service` · `custom`.

---

## Every session

1. Copy session prompt for `<workflow-id>`
2. New chat (never Verify in the write chat)
3. Confirm `blueprint.md` and changed docs at the end

**Compaction:** after long sessions (≥2 blueprint phases, ≥15 files, ≥30 turns), start a new chat; resume using the session log in `blueprint.md`.

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

Architect / Domain work: traverse **links first**; write `work/YYYY-MM-DD-<slug>.md`; register `WRK-NNN` in `blueprint.md` ## Work register with **Track** `architecture` or `domain`; link to template and `domain/` sections, do not duplicate.

---

## Mechanisms (built into AGM)

| Mechanism | Purpose |
|-----------|---------|
| `always-on.md` | Stable app facts every session |
| `blueprint.md` | Construction plan + progress across sessions |
| `entry-point.md` | Human-readable entry and navigation |
| Track + Activity + Mode | Consistent workflow vocabulary |
| Roles | Same steps per operation family; workflows vary the activity |
| Verify (fresh chat, report-only) | Separate generation from evaluation |
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

**One-liner:** Build the graph → evolve it → architect + domain work on the graph — one session prompt per chat, vocabulary: **Track · Activity · Mode**.
