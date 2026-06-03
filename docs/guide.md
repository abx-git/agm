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
| **Session prompt** | This chat’s task — paste from [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) or [prompts/workflows/](../prompts/workflows/) |
| **Role** | Step-by-step procedure → `docs/architecture/prompts/role-*.md` (agent reads; you pick the session prompt only) |

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

## Operations

| Goal | Workflow | New chat |
|------|----------|----------|
| Adopt pattern (prompt-driven) | paste [adopt-standalone](../prompts/adopt-standalone.md) or `bootstrap-adopt` | Yes |
| Continue bootstrap | `bootstrap-continue` | Yes |
| Deepen one area | `refinement` | Yes |
| After code change | `maintenance` (+ paste `git diff`) | Yes |
| Question | `architecture-work-query` | Yes |
| Analysis | `architecture-work-analysis` | Yes |
| Design | `architecture-work-design` | Yes |
| Open WRK items | `architecture-work-continue` | Yes |
| Verify (no fixes) | `review-phase` / `review-milestone` / `review-maintenance` | **Required** |

Session prompt source files: [prompts/workflows/](../prompts/workflows/). Copy the session block into a new chat — no checkout script in the application repo.

*(Optional in this pattern repository only: `./scripts/bp-workflow.sh checkout <id>` writes `ACTIVE.md` for Cursor rule integration.)*

---

## Setup (once, ~30 min)

**Recommended — adoption prompt:** open your application repository in the IDE, start a new chat, paste the session prompt from [prompts/adopt-standalone.md](../prompts/adopt-standalone.md) or the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/). The agent **writes** the folder structure, `always-on.md`, and `blueprint.md` in one session — no git clone, zip, or checkout script.

After scaffold exists, copy session prompts for later chats. Enable [CI link check](../prompts/reference/ci-integrity.md) on the app repo.

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

**One-liner:** One core prompt, one session prompt per chat, one graph in `docs/architecture/`, `blueprint.md` for state.
