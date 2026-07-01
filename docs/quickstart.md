# AGM — 10-minute quickstart

**Thesis:** Architecture documentation is the **API of AI conversation**.

**AGM in one sentence:** A repo-local Markdown link graph, orchestrated by `blueprint.md`, maintained by agents via MCP.

*(Source: [blueprint-pattern](https://github.com/abx-git/blueprint-pattern) on GitHub — legacy repo name; method is AGM.)*

---

## Golden path

One onboarding path — everything else is advanced.

| Step | What you do | Workflow |
|------|-------------|----------|
| **Install** | Run generated script at your app repo root | [Assistant → Build → Install](https://abx-git.github.io/agm.github.io/) → `bp-install.sh` |
| **Adopt** | New chat — first evidence-based section | `bootstrap-adopt` |
| **Continue** | New chat — next chapter from construction plan | `bootstrap-continue` |
| **Maintain** | New chat — sync docs with code | `maintenance-diff-range` |
| **Review** | **Fresh chat** — report only, never same chat as write | `review-maintenance` |

Copy the session prompt from the Assistant UI (or `prompts/workflows/<id>.md`) into a new chat. **Default:** copy-paste. **Optional:** MCP `agm_trigger_workflow` — golden path works with the public starter pack ([agm/README.md](../agm/README.md)).

**Install vs `agm init`:** use `bp-install.sh` (or `agm install`) for the full scaffold; `agm init` creates only three core files — [reference/install.md](./reference/install.md).

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/blueprint-pattern/main/scripts/bp-install.sh | bash -s -- \
  --project "my-app" --template arc42
```

Templates at adopt time: **`arc42`** (multi-module, default) or **`lean-service`** (single service). Others → [guide.md](./guide.md) advanced section.

---

## Four orchestration files

```
docs/architecture/
├── context/always-on.md   ← every session: app identity, stack, source map
├── blueprint.md           ← agent: construction plan, [ ]/[~]/[x]/[!], WRK, session log
├── entry-point.md         ← agent: graph index — links only, no status
└── index.md + log.md      ← OKF: per-folder disclosure + change log
```

**Rule:** `entry-point.md` = agent navigation. `index.md` = OKF folder index. Never conflate them.

Work items: `work/YYYY-MM-DD-<slug>.md` + `WRK-NNN` in `blueprint.md`. Also traverse `interfaces/exports.md` and `interfaces/imports.md` every session — cross-service contracts, not wiki/RAG.

---

## Why this beats context dumps

```text
Traditional                         AGM
───────────                         ───
Paste repo / long chat history  →   Agent reads always-on.md + blueprint.md
Similarity search (RAG)         →   Follow links from entry-point.md
Stale wiki                      →   git diff → maintenance-diff-range
Same chat writes + reviews      →   Fresh chat for Verify
```

Three mechanisms: **Documentation API** (typed OKF Markdown the agent traverses) · **MCP transport** (code and docs on demand) · **Session discipline** (`blueprint.md` progress + fresh review chats).

The graph is also the **spec API for implementation**: design WRK items + `interfaces/` guide code sessions; **Maintenance** syncs docs after merge. Distinction from feature-spec tools (e.g. Kiro): [reference/spec-driven-development.md](./reference/spec-driven-development.md).

---

## Essential workflows

| When | Workflow | Fresh chat? | You get |
|------|----------|-------------|---------|
| First setup | `bootstrap-adopt` | Yes | `blueprint.md`, `entry-point.md`, first section |
| Next chapter | `bootstrap-continue` | Yes | One more template section |
| Deepen a section | `refinement` | Yes | Richer view for one file |
| Code changed | `maintenance-diff-range` | Yes | Doc sync from git range |
| Architecture Q / design | `architecture-work-query` / `architecture-work-design` | Yes | `work/YYYY-MM-DD-<slug>.md` + WRK |
| After sync or milestone | `review-maintenance` / `review-phase` | **Required** | Report in `work/`, no edits |

Extended catalog (domain DDD, event storm, sustainable analysis, …): [guide.md § Workflows](./guide.md).

---

## Phase states and anchors

Progress in `blueprint.md` uses `[ ]` pending · `[~]` in progress · `[x]` done · `[!]` blocked.

Agents output semantic anchors before stopping (session checklist):

| Anchor | Meaning |
|--------|---------|
| `LINK_CHECK` | `pass` or `fail` — relative links valid |
| `CHANGED_FILES` | Files touched this session |
| `WORK_ITEM` | New/updated `work/` + WRK entry |
| `VERDICT` / `FINDINGS` | Review outcome (Verify only) |
| `OPEN_QUESTIONS` | Unresolved assumptions |

**Compaction:** new chat after long sessions (≥2 phases, ≥15 files, or ≥30 turns); resume from `blueprint.md` session log.

**CI:** enable [`blueprint-pattern-integrity`](https://github.com/abx-git/blueprint-pattern/blob/main/.github/workflows/blueprint-pattern-integrity.yml) on your app repo — broken links fail the PR.

---

## Human responsibilities

- Approve blueprint phases before marking `[x]`
- Run Verify in a **fresh chat** (never the write/sync chat)
- Ship doc updates in the **same PR** as architectural code changes

---

## What AGM does not solve

- **Model hallucination** — graph traversal reduces it; humans still validate claims
- **Secrets in prompts** — never paste credentials; redact diffs
- **Live production state** — static docs ≠ metrics, logs, or runtime topology
- **Org ownership** — without PR rules and named owners, the graph goes stale
- **Parallel agents on one blueprint** — one doc-writing agent per app at a time

Details: [gen-ai-challenges.md](./gen-ai-challenges.md) (leads / governance).

---

## Further reading

[guide.md](./guide.md) · [reference/extended-workflows.md](./reference/extended-workflows.md) · [reference/spec-driven-development.md](./reference/spec-driven-development.md) · [ROADMAP.md](./ROADMAP.md) · [typical-dialog.md](./typical-dialog.md) · [architects article](./article/blueprint-pattern-for-architects.md) · [sample app](./examples/sample-app/) · [MCP/CLI](../agm/README.md)
