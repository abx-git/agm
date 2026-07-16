# Architecture Graph Method (AGM) — Guide

Operational reference. **Start with [quickstart.md](./quickstart.md)** (~10 min).

Architecture documentation as a **Markdown link graph** in `docs/architecture/`, maintained with AI agents, versioned in Git.

**Golden path:** Install → Adopt → Continue → Maintain → Review. Copy session prompts from the [Assistant UI](https://abx-git.github.io/agm.github.io/). MCP `agm_trigger_workflow` uses **LLMLingua-2 compressed** prompts from `@abx-hh/agm-cli` ([install](./reference/agm-mcp-install.md)) — golden path on npm; extended workflows need the private pack ([agm/README.md](../agm/README.md)).

---

## Essential workflows (7)

| Intent | Workflow | Fresh chat? |
|--------|----------|-------------|
| First-time setup | `bootstrap-adopt` | Yes |
| Next doc chapter | `bootstrap-continue` | Yes |
| Deepen one section | `refinement` | Yes |
| Import pasted content | `content-ingest` | Yes |
| Code changed | `maintenance-diff-range` | Yes |
| After sync | `review-maintenance` | **Required** |
| Milestone / phase check | `review-phase` | **Required** |

Architect/Domain and other Advanced intents: [reference/extended-workflows.md](./reference/extended-workflows.md) (opt-in install `--full` / `--domain`).

---

## Setup (once)

1. **Install** — [Assistant → Build → Install](https://abx-git.github.io/agm.github.io/) → run `agm-install.sh` at app repo root (default = golden path). See [reference/install.md](./reference/install.md).
2. **Adopt** — copy adoption prompt → new chat. Agent creates `blueprint.md`, `entry-point.md`, `always-on.md`, first section.
3. **CI** — enable [agm-integrity](./reference/ci-integrity.md) on the app repo.

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
├── sources/               ← pasted imports (Confluence, specs) with provenance
├── use-cases/             ← distilled scenarios (optional)
└── arc42/                 ← or lean-service/, etc.
```

**Rule:** `entry-point.md` = agent navigation. `index.md` = OKF structure. Never conflate them.

---

## Assistant UI labels

Tabs **Build** · **Evolve** · **Verify** plus collapsed **Advanced** are UI organization only — not a doctrine to memorize. One chat = one session = one workflow.

After a graph exists, Advanced holds Architect and Domain (DDD) intents. Install those packs with `--full` or `--domain` (see [install.md](./reference/install.md)).

---

## Terms

| Term | Meaning |
|------|---------|
| **Graph** | Linked Markdown under `docs/architecture/` |
| **Blueprint** | `blueprint.md` — construction plan, progress, WRK |
| **Entry** | `entry-point.md` — agent link map, no phase status |
| **Session** | One chat = one workflow |
| **Review** | Fresh-chat Verify — report only |
| **Core prompt** | [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) |
| **AGM** | Architecture Graph Method — method and [repository](https://github.com/abx-git/agm) |

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

### AGM platform (workflows, prompts) — safe

When a new AGM release adds workflows or updates procedures, **do not re-run install**. Use [upgrade.md](./reference/upgrade.md):

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-upgrade.sh | bash
# or: npx @abx-hh/agm-cli upgrade
```

Architecture content (`blueprint.md`, template chapters, `work/`, …) is preserved.

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
| [article/agm-for-architects.md](./article/agm-for-architects.md) | Principles |
| [examples/sample-app/](./examples/sample-app/) | Multi-service example |
