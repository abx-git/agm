# AGM documentation roadmap

Consolidated plan to make agm concise and straightforward. Target one-liner for adopters:

> AGM keeps architecture in a linked Markdown graph in my repo; I install once, adopt in one chat, continue chapter by chapter, sync on git diff, and verify in a fresh chat — the agent reads `always-on.md` and `blueprint.md`, traverses from `entry-point.md`, and pulls code through MCP when needed.

**Public thesis:** Architecture documentation is the API of AI conversation.

**AGM in one sentence:** A repo-local Markdown link graph, orchestrated by `blueprint.md`, maintained by agents via MCP.

---

## Priority checklist

| Priority | Action | Status | Notes |
|----------|--------|--------|-------|
| **P0** | Write [quickstart.md](./quickstart.md) + slim [README](../README.md) | done | Mandatory read path |
| **P0** | Fix `entry-point.md` vs `index.md` documentation | done | Rule in quickstart + guide |
| **P0** | Declare golden path; resolve MCP vs copy-paste | done | Default: copy prompt; MCP optional |
| **P1** | Cut user-facing workflow list to 6 essentials | done | Guide + Assistant UI + extended-workflows.md |
| **P1** | Add “documentation as API” thesis to README | done | |
| **P1** | Ship minimal public prompt pack for MCP golden path | done | `agm/data/workflows-starter-prompts.json` (**6** workflows) |
| **P1** | Trial: demote Architect/Domain (1A) + starter-6 (query/design out of public pack) | done | Default install golden; `--domain`/`--full`; Advanced UI |
| **P2** | Trim [guide.md](./guide.md) to ~150 lines (operational reference) | done | ~131 lines |
| **P2** | Merge/split long docs per budget | done | gen-ai, typical-dialog trimmed |
| **P2** | Move `prompts/reference/*` → `docs/reference/` | done | Installed apps still use `prompts/reference/` |
| **P2** | Reduce templates to 2 defaults at adopt (`arc42`, `lean-service`) | done | [advanced-templates.md](./reference/advanced-templates.md) |
| **P2** | Fold [migration-arc42-only.md](./migration-arc42-only.md) into guide § Upgrading | done | Stub redirect remains |
| **P2** | Trim [gen-ai-challenges.md](./gen-ai-challenges.md) to summary + link | done | Detail in [gen-ai-governance.md](./reference/gen-ai-governance.md) |
| **P2** | Trim [typical-dialog.md](./typical-dialog.md) to 2–3 dialogs | done | 3 golden-path dialogs |
| **P2** | Add [case-studies.md](./case-studies.md) | done | Sample app + contribution stubs |
| **P2** | Add [spec-driven-development.md](./reference/spec-driven-development.md) | done | AGM vs feature-centric SDD boundary |
| **P3** | Deprecate legacy workflow IDs in Assistant UI labels | done | Intent labels; IDs internal to prompts |
| **P3** | Assistant UI: golden path tab order; Advanced collapsed | done | Build · Evolve · Verify · Advanced |
| **P3** | Unify `agm init` and `agm-install.sh` scaffold output | done | [reference/install.md](./reference/install.md) + `agm install` |
| **P3** | Retire “Blueprint Pattern”; rename repo/scripts to AGM | done | Repo `abx-git/agm`, `agm-install.sh` / `agm-workflow.sh`, Cursor rules `agm*.mdc` |

---

## Doc budget (target)

| Document | Max lines | Audience |
|----------|-----------|----------|
| [README.md](../README.md) | 80 | Everyone |
| [quickstart.md](./quickstart.md) | 120 | Everyone |
| [guide.md](./guide.md) | 150 | Practitioners |
| [docs/reference/](./reference/) | split by topic | Lookup |
| Everything else | appendix | Optional |

---

## Golden path (canonical onboarding)

| Step | User action | Workflow / tool |
|------|-------------|-----------------|
| Install | Run `agm-install.sh` once at app repo root (default = golden) | [Assistant UI](https://abx-git.github.io/agm.github.io/) generates script |
| Adopt | One new chat | `bootstrap-adopt` |
| Continue | Next blueprint chapter | `bootstrap-continue` |
| Maintain | After code change | `maintenance-diff-range` (paste diff = fallback) |
| Review | Fresh chat after write/sync | `review-maintenance` or `review-phase` |

**Advanced (not Day-1):** Architect/Domain → Assistant Advanced + install `--full` / `--domain` · MCP private pack · `ACTIVE.md` / `agm-workflow.sh`.

---

## Public vocabulary (five words)

| Term | Meaning |
|------|---------|
| **Graph** | Linked Markdown in `docs/architecture/` |
| **Blueprint** | `blueprint.md` — construction plan, progress, WRK register |
| **Entry** | `entry-point.md` — agent navigation (links only) |
| **Session** | One chat = one workflow |
| **Review** | Fresh-chat Verify — report only |

UI tabs (Build / Evolve / Verify / Advanced) are labels only. Demote **Track**, **Activity**, and **Mode** to workflow metadata. Legacy workflow IDs stay internal.

---

## Six essential workflows

| Intent | Workflow | Fresh chat? |
|--------|----------|-------------|
| First-time setup | `bootstrap-adopt` | Yes |
| Next doc chapter | `bootstrap-continue` | Yes |
| Deepen one section | `refinement` | Yes |
| Code changed | `maintenance-diff-range` | Yes |
| After sync | `review-maintenance` | **Required** |
| Phase check | `review-phase` | **Required** |

`architecture-work-query` / `architecture-work-design` and Domain/DDD → Advanced / `--full` (not public starter). Remaining workflows → [extended-workflows.md](./reference/extended-workflows.md).

---

## Content accuracy (ctx-eng sync)

- [x] Never present PlantUML C4, Pugh matrix, six-part QAS as AGM defaults — label as arc42 example vocabulary ([advanced-templates.md](./reference/advanced-templates.md))
- [x] External talks/articles: name AGM; link to `docs/quickstart.md`
- [ ] Remove any `.wrk` references from diagrams (none in repo today)
- [ ] Standardize work items: `work/YYYY-MM-DD-<slug>.md` + `WRK-NNN` in `blueprint.md`

---

## Tooling alignment

| Item | Target |
|------|--------|
| CLI entry | `agm install` prints `agm-install.sh`; `agm init` = 3 files only |
| MCP in public docs | `agm_load_context`, `agm_get_graph_status`, `agm_trigger_workflow`, `agm_verify_links` only |
| CI | One sentence in quickstart: enable `agm-integrity` workflow |

---

## Governance

- [CONTRIBUTING](../CONTRIBUTING.md): prioritize case studies and quickstart clarity over new workflow variants
- Keep “What AGM does not solve” and “Human responsibilities” in quickstart (distilled from gen-ai-challenges)
