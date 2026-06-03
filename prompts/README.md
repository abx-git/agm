# Blueprint Pattern — Prompts (reference)

**Start here:** [Quick start guide (EN)](../docs/quick-start-guide.md) · [Kurzanleitung (DE)](../docs/anleitung.md) · [Gen AI challenges](../docs/gen-ai-challenges.md)

This folder is the **technical reference** (workflows, git checkout, file index). You do not need it for day-to-day use if you follow the guide above.

---

## Three layers (collapsed)

| Layer | Path |
|-------|------|
| Core (once) | [core/system-prompt.md](./core/system-prompt.md) |
| Session (per chat) | [workflows/ACTIVE.md](./workflows/ACTIVE.md) ← set via `./scripts/bp-workflow.sh checkout <id>` |
| App docs (ongoing) | `docs/architecture/` in your application repo |

Role files (`role-*.md`) are read **by the agent** from the active workflow — you do not pick them manually.

---

## Workflows

| ID | When |
|----|------|
| `bootstrap-init` | First-time documentation |
| `bootstrap-continue` | Resume arc42 phases |
| `refinement` | Deepen specific sections |
| `maintenance` | After code change (`git diff`) |
| `architecture-work-query` | Answer a question |
| `architecture-work-analysis` | Structured analysis |
| `architecture-work-design` | Design proposal |
| `architecture-work-continue` | Open WRK items |
| `review-phase` | Check one phase (fresh session) |
| `review-milestone` | After bootstrap (fresh session) |
| `review-maintenance` | After maintenance (fresh session) |

Source files: [workflows/](./workflows/) · Index: [PROMPT.md](../PROMPT.md)

---

## Activate a workflow

```bash
./scripts/bp-workflow.sh list
./scripts/bp-workflow.sh checkout maintenance
```

Git (optional, share in team):

```bash
git checkout origin/workflow/maintenance -- prompts/workflows/ACTIVE.md .cursor/rules/blueprint-active-workflow.mdc
```

Create branches: `./scripts/setup-workflow-branches.sh`

---

## Reference

- [blueprint-format.md](./reference/blueprint-format.md)
- [base-context-setup.md](./reference/base-context-setup.md)
- [ci-integrity.md](./reference/ci-integrity.md)
