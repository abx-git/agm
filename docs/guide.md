# Architecture Graph Method (AGM) — Guide

Operational reference. **Start with [quickstart.md](./quickstart.md)** (~10 min).

Architecture documentation as a **Markdown link graph** in `docs/architecture/`, maintained with AI agents, versioned in Git.

**Golden path:** Install → Adopt → Continue → Maintain → Review. Copy session prompts from the [Assistant UI](https://abx-git.github.io/agm.github.io/). MCP `agm_trigger_workflow` uses the same prompts — public **starter pack** covers the golden path; extended workflows need the full private pack ([agm/README.md](../agm/README.md)).

---

## Essential workflows

| Intent | Workflow | Fresh chat? |
|--------|----------|-------------|
| First-time setup | `bootstrap-adopt` | Yes |
| Next doc chapter | `bootstrap-continue` | Yes |
| Deepen one section | `refinement` | Yes |
| Code changed | `maintenance-diff-range` | Yes |
| Architecture question / design | `architecture-work-query` / `architecture-work-design` | Yes |
| After sync | `review-maintenance` | **Required** |
| Milestone check | `review-phase` | **Required** |

Extended catalog (domain DDD, dialog-mode, analysis): [reference/extended-workflows.md](./reference/extended-workflows.md).

---

## Setup (once)

1. **Install** — [Assistant → Build → Install](https://abx-git.github.io/agm.github.io/) → run `bp-install.sh` at app repo root. Or `agm install` prints the same curl command — see [reference/install.md](./reference/install.md).
2. **Adopt** — copy adoption prompt → new chat. Agent creates `blueprint.md`, `entry-point.md`, `always-on.md`, first section.
3. **CI** — enable [blueprint-pattern-integrity](./reference/ci-integrity.md) on the app repo.

**Templates at adopt:** `arc42` (multi-module, default) · `lean-service` (single service). Record choice in `entry-point.md`. Advanced: [reference/advanced-templates.md](./reference/advanced-templates.md).

Alternative: [adopt-standalone](../prompts/adopt-standalone.md) after manual install.

---

## Every session

1. Copy session prompt → **new chat** (never Verify in the write chat).
2. Agent reads `context/always-on.md` + `blueprint.md`, traverses from `entry-point.md`.
3. Agent updates `blueprint.md` and outputs semantic anchors before stop.

**Compaction:** new chat after ≥2 phases, ≥15 files, or ≥30 turns; resume from session log in `blueprint.md`.

---

## File model

```
docs/architecture/
├── context/always-on.md   ← every session: identity, stack, source map
├── blueprint.md           ← construction plan, [ ]/[~]/[x]/[!], WRK, session log
├── entry-point.md         ← agent navigation — links only
├── index.md + log.md      ← OKF per-folder index + change log
├── interfaces/            ← exports.md, imports.md
├── work/                  ← YYYY-MM-DD-<slug>.md + WRK-NNN in blueprint.md
└── arc42/                 ← or lean-service/, etc.
```

**Rule:** `entry-point.md` = agent navigation. `index.md` = OKF structure. Never conflate them.

---

## Tracks

**Build** · **Evolve** · **Architect** · **Domain** · **Verify** — one chat = one session.

Graph maturity: Build → Evolve → Architect/Domain work. Verify runs in a **fresh chat** after write/sync (report-only).

---

## Terms

| Term | Meaning |
|------|---------|
| **Graph** | Linked Markdown under `docs/architecture/` |
| **`blueprint.md`** | Construction plan — not architecture body text |
| **`entry-point.md`** | Agent link map — no phase status |
| **Track** | Build, Evolve, Architect, Domain, Verify |
| **Core prompt** | [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) |
| **Session prompt** | Per-chat task from Assistant or `prompts/workflows/` |
| **AGM** | The method. *blueprint-pattern* = legacy repo name |

---

## Mechanisms

| Mechanism | Purpose |
|-----------|---------|
| Documentation API | Typed OKF Markdown the agent traverses |
| MCP transport | Code and docs on demand; traverse `interfaces/exports.md` and `imports.md` |
| Session discipline | `blueprint.md` progress + fresh Verify chats |
| Semantic anchors | `LINK_CHECK`, `CHANGED_FILES`, `WORK_ITEM`, `VERDICT`, … |
| CI link check | Broken relative links fail PR |

---

## Verify: when to use which

| Workflow | When |
|----------|------|
| `review-maintenance` | After `maintenance-diff-range` or code sync |
| `review-phase` | After completing a blueprint construction phase |
| `review-milestone` | End of Build stage (extended catalog) |

---

## App layout reference

Architect / Domain work: traverse links first; write `work/YYYY-MM-DD-<slug>.md`; register `WRK-NNN` in `blueprint.md` ## Work register with Track `architecture` or `domain`.

Day to day: (1) core prompt in IDE rules, (2) content in `docs/architecture/`, (3) session prompt per chat.

---

## Upgrading

### Arc42-only wording → optional templates

No breaking change for existing arc42 adopters.

**If you already use arc42:** Keep `arc42/` layout. Add to `entry-point.md`:

```markdown
## Documentation template

Selected template: arc42
Rationale: <why arc42 fits this system>
```

Replace role prompts from [templates/architecture/prompts/](templates/architecture/prompts). Adopt the [core prompt](../prompts/core/system-prompt.md).

**Lighter template:** See [reference/advanced-templates.md](./reference/advanced-templates.md) for `c4-light`, `adr-first`, `lean-service`, `custom` migration steps.

**Human review:** Template changes are architectural decisions — record rationale in `entry-point.md` and run Verify in a fresh chat before removing old sections.

---

## Further reading

| Document | When |
|----------|------|
| [quickstart.md](./quickstart.md) | Mandatory first read |
| [reference/index.md](./reference/index.md) | Format specs and lookup |
| [reference/extended-workflows.md](./reference/extended-workflows.md) | Full workflow list |
| [ROADMAP.md](./ROADMAP.md) | Consolidation progress |
| [typical-dialog.md](./typical-dialog.md) | Sample sessions |
| [gen-ai-challenges.md](./gen-ai-challenges.md) | Governance summary (leads) |
| [reference/spec-driven-development.md](./reference/spec-driven-development.md) | AGM vs feature SDD |
| [case-studies.md](./case-studies.md) | Real-world applications |
| [article/blueprint-pattern-for-architects.md](./article/blueprint-pattern-for-architects.md) | Principles |
| [examples/sample-app/](./examples/sample-app/) | Multi-service example |
