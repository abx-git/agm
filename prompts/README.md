# Workflows

Procedure: **[docs/guide.md](../docs/guide.md)** · **[docs/typical-dialog.md](../docs/typical-dialog.md)**

## Golden path (Day-1 — default install)

| Intent | Workflow |
|--------|----------|
| Adopt | [bootstrap-adopt](./workflows/bootstrap-adopt.md) |
| Continue | [bootstrap-continue](./workflows/bootstrap-continue.md) |
| Deepen | [refinement](./workflows/refinement.md) |
| Sync | [maintenance-diff-range](./workflows/maintenance-diff-range.md) |
| Review after sync | [review-maintenance](./workflows/review-maintenance.md) |
| Review phase | [review-phase](./workflows/review-phase.md) |

## Advanced (opt-in `--full` / `--domain`)

Architect, Domain (DDD), paste-diff maintenance, milestone review — see [docs/reference/extended-workflows.md](../docs/reference/extended-workflows.md) and Assistant **Advanced**.

| Path | Purpose |
|------|---------|
| [../scripts/agm-install.sh](../scripts/agm-install.sh) | Install (default golden; `--full` / `--domain`) |
| [adopt-standalone.md](./adopt-standalone.md) | Adopt after install; or [Assistant UI](https://abx-git.github.io/agm.github.io/) |
| [core/system-prompt.md](./core/system-prompt.md) | IDE rules |
| [reference/adopt-procedure.md](./reference/adopt-procedure.md) | Agent adoption reference |

Copy session prompts from the Assistant UI or from `prompts/workflows/<id>.md` after install.
