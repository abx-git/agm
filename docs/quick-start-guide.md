# Blueprint Pattern — Quick start guide

> **Goal:** Architecture documentation in the repo that a AI agent can **read and maintain via links** — no RAG, no external wiki.

If too many concepts get in the way: **read only this page**. Everything else is depth.

**Deutsch:** [Kurzanleitung](./anleitung.md)

---

## Overview (what matters)

You only need **three things** day to day:

| # | What | Where | How often |
|---|------|-------|-----------|
| 1 | **Agent rules** | `prompts/core/system-prompt.md` → Cursor / Claude / Copilot | Set up **once** |
| 2 | **Application documentation** | `docs/architecture/` (especially `blueprint.md`) | Ongoing, versioned in Git |
| 3 | **Current task** | `prompts/workflows/ACTIVE.md` | Switch **per chat session** |

Everything else (roles, arc42, workflows, branches) exists only to prepare **item 3** — you do not need to learn those concepts separately.

```text
  Once                      Every session
  ────                      ─────────────
  Rules (core prompt)  +    ACTIVE.md (what should the agent do now?)
         │                           │
         └───────────┬───────────────┘
                     ▼
              Agent works in docs/architecture/
                     │
                     ▼
              blueprint.md updated (progress, log)
```

---

## Five tasks (operations)

How you work **in practice** — no more concepts than this table:

| You want to … | Workflow ID | Notes |
|---------------|-------------|-------|
| **Create** documentation | `bootstrap-init` | First time |
| **Continue** writing (arc42) | `bootstrap-continue` | Next open phase |
| **Deepen** specific chapters | `refinement` | e.g. runtime only |
| **Update** docs after code change | `maintenance` | With `git diff` |
| **Question / analysis / design** | `architecture-work-*` | Output in `work/` |
| **Verify** docs (no fixes) | `review-*` | **New** chat |

Always run **review** in a **fresh session** — the agent should verify, not write and judge in the same pass.

---

## One-time setup (~30 minutes)

1. Copy the **core prompt** from [prompts/core/system-prompt.md](../prompts/core/system-prompt.md) into IDE rules (Cursor: `.cursor/rules/` — see [base context setup](../prompts/reference/base-context-setup.md)).
2. Copy **templates** from [docs/templates/architecture/](../docs/templates/architecture/) to `docs/architecture/` in **your application repo**.
3. Fill in **`context/always-on.md`** (app name, key paths).
4. Activate a workflow and start the agent:

```bash
./scripts/bp-workflow.sh checkout bootstrap-init
```

Open a new chat — the agent reads `ACTIVE.md` and creates `blueprint.md`.

---

## Every later session (3 steps)

1. **Pick a workflow** (one line):

```bash
./scripts/bp-workflow.sh checkout maintenance
```

Without the script: copy the session block from [prompts/workflows/maintenance.md](../prompts/workflows/maintenance.md) into the chat.

2. **Start a new chat** (required for review).

3. **Quick check** at the end: Did the agent update `blueprint.md` and the affected files?

List workflows:

```bash
./scripts/bp-workflow.sh list
```

---

## Git checkout (optional)

Only if you want to **share the active workflow** with the team via Git:

```bash
git fetch origin
git checkout origin/workflow/maintenance -- prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc
```

Create branches: `./scripts/setup-workflow-branches.sh` (once, then push).

For getting started, the **script** is enough — Git branches are optional.

---

## Where things live (one folder)

Everything important is under **`docs/architecture/`** in your application:

| File / folder | Meaning |
|---------------|---------|
| `blueprint.md` | Progress, open work, session log |
| `entry-point.md` | Entry into the doc set (overview) |
| `arc42/` (or similar) | Architecture chapters (template choice) |
| `interfaces/` | Inbound / outbound contracts |
| `work/` | Questions, analyses, designs, review reports |
| `prompts/role-*.md` | Detailed steps per task type (read by the agent) |

In **this pattern repository**, templates and session texts live under `prompts/workflows/`.

---

## What you can skip for now

| Topic | Read when … |
|-------|-------------|
| arc42 vs. c4-light vs. lean-service | you start bootstrap |
| Extensions, compaction, ops | the system grows |
| Semantic anchors (`[[ANCHOR:…]]`) | you build CI / automation |
| [PROMPT.md](../PROMPT.md), [prompts/README.md](../prompts/README.md) | you need individual files |

---

## Go deeper

| Document | Content |
|----------|---------|
| [Gen AI challenges & mitigations](./gen-ai-challenges.md) | LLM problems: pattern vs. **organizational fixes** vs. **unsolvable** |
| [Blueprint Pattern for Architects](./article/blueprint-pattern-for-architects.md) | Full method, principles |
| [Sample application](./examples/sample-app/) | Complete `docs/architecture/` |
| [Architecture Work guide](./architecture-work-guide.md) | Query / analysis / design |
| [prompts/README.md](../prompts/README.md) | All workflow IDs + Git details |

---

## One-liner

**One prompt for behavior, one ACTIVE for the task, one Blueprint for state** — the rest is Markdown structure.
