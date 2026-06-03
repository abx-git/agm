# Blueprint Pattern — Guide

Architecture documentation as a **Markdown link graph** in `docs/architecture/`, maintained with AI agents, versioned in Git. No RAG, no external wiki.

**Sample app:** [examples/sample-app](./examples/sample-app/) · **Dialogs:** [typical-dialog.md](./typical-dialog.md) · **Assistant:** [abx-git.github.io/blueprint-pattern.github.io](https://abx-git.github.io/blueprint-pattern.github.io/) — [Pages setup](./assistant/GITHUB-PAGES-SETUP.md)

---

## Terms (read once)

| Term | Meaning |
|------|---------|
| **Graph** | Linked docs: `entry-point.md`, template folders (e.g. `arc42/`), `interfaces/`, `work/`, `ops/` |
| **`blueprint.md`** | Session **backlog**: phase status, WRK registry, reviews, session log — not the full architecture |
| **Blueprint Pattern** | The whole method: graph + operations + agent rules |
| **Core prompt** | Permanent agent behavior → [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) |
| **Workflow** | This chat’s task → [prompts/workflows/ACTIVE.md](../prompts/workflows/ACTIVE.md) via `bp-workflow.sh` |
| **Role** | Step-by-step procedure → `docs/architecture/prompts/role-*.md` (agent reads; you pick workflow only) |

```text
Core rules (once) + ACTIVE workflow (per chat) → agent → docs/architecture/ → update blueprint.md
```

---

## Day to day: three things

| # | What | Where |
|---|------|-------|
| 1 | Agent rules | `prompts/core/system-prompt.md` in IDE rules |
| 2 | Architecture content | `docs/architecture/` in your app repo |
| 3 | Current task | `./scripts/bp-workflow.sh checkout <id>` → `ACTIVE.md` |

---

## Operations

| Goal | Workflow | New chat |
|------|----------|----------|
| Create docs | `bootstrap-init` | Yes |
| Continue arc42 | `bootstrap-continue` | Yes |
| Deepen one area | `refinement` | Yes |
| After code change | `maintenance` (+ paste `git diff`) | Yes |
| Question | `architecture-work-query` | Yes |
| Analysis | `architecture-work-analysis` | Yes |
| Design | `architecture-work-design` | Yes |
| Open WRK items | `architecture-work-continue` | Yes |
| Verify (no fixes) | `review-phase` / `review-milestone` / `review-maintenance` | **Required** |

```bash
./scripts/bp-workflow.sh list
./scripts/bp-workflow.sh checkout maintenance
```

Workflow source files: [prompts/workflows/](../prompts/workflows/). Optional: commit `ACTIVE.md` so the team shares the same task.

---

## Setup (once, ~30 min)

**Adoption kit (recommended):** [Download `blueprint-pattern-adopt.zip`](https://github.com/abx-git/blueprint-pattern/releases/latest/download/blueprint-pattern-adopt.zip) — unpack at your application repository root. Read `ADOPT.md` in the archive.

Or build locally: `./scripts/build-adoption-package.sh`

1. Fill `docs/architecture/context/always-on.md`.
2. Copy `ide/cursor/*.mdc` from the kit to `.cursor/rules/` (or wire [core system prompt](../prompts/core/system-prompt.md) for your IDE — [tool notes](../prompts/reference/base-context-setup.md)).
3. `checkout bootstrap-init` → new chat → agent creates `blueprint.md` and first sections.
4. Enable [CI link check](../prompts/reference/ci-integrity.md) on the app repo.

**Template** (record in `entry-point.md`): `arc42` (default) · `c4-light` · `adr-first` · `lean-service` · `custom`.

---

## Every session

1. `checkout <workflow>`
2. New chat (never review in the write chat)
3. Confirm `blueprint.md` and changed docs at the end

**Compaction:** after long sessions (≥2 phases, ≥15 files, ≥30 turns), start a new chat; resume using the session log in `blueprint.md`.

---

## App layout

```
docs/architecture/
├── blueprint.md      ← progress & session log
├── entry-point.md
├── context/          ← always-on.md, on-demand.md
├── prompts/          ← role-*.md (from templates)
├── work/             ← questions, analyses, designs, reviews
├── interfaces/       ← exports.md, imports.md
├── ops/              ← runbooks, pitfalls (when needed)
└── arc42/            ← or c4-light/, adr-first/, lean-service/
```

Architecture Work: traverse **links only**; write `work/YYYY-MM-DD-<slug>.md`; register `WRK-NNN` in `blueprint.md`; link to arc42, do not duplicate.

---

## Mechanisms (built into the pattern)

| Mechanism | Purpose |
|-----------|---------|
| `always-on.md` | Stable app facts every session |
| Roles | Same steps per operation family; workflows vary the task |
| Review (fresh chat, report-only) | Separate generation from verification |
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

---

**One-liner:** One core prompt, one ACTIVE per chat, one graph in `docs/architecture/`, `blueprint.md` for state.
