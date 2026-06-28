# Workflows

Procedure: **[docs/guide.md](../docs/guide.md)** · **[docs/typical-dialog.md](../docs/typical-dialog.md)**

## Lifecycle

| Phase | Workflows |
|-------|-----------|
| **1 · Build** | [bootstrap-adopt](./workflows/bootstrap-adopt.md), [bootstrap-continue](./workflows/bootstrap-continue.md), [review-milestone](./workflows/review-milestone.md) |
| **2 · Evolve** | [refinement](./workflows/refinement.md), [maintenance](./workflows/maintenance.md), [maintenance-diff-range](./workflows/maintenance-diff-range.md) |
| **3 · Work** | [architecture-work-query](./workflows/architecture-work-query.md), [-analysis](./workflows/architecture-work-analysis.md), [-sustainable-analysis](./workflows/architecture-work-sustainable-analysis.md), [-sustainable-interrogate](./workflows/architecture-work-sustainable-interrogate.md), [-design](./workflows/architecture-work-design.md), [-continue](./workflows/architecture-work-continue.md) |
| **Review** | [review-phase](./workflows/review-phase.md), [review-maintenance](./workflows/review-maintenance.md) |

| Path | Purpose |
|------|---------|
| [../scripts/bp-install.sh](../scripts/bp-install.sh) | **Build phase prep** — install prompts + scaffold (HTTPS, no git clone) |
| [adopt-standalone.md](./adopt-standalone.md) | **Build phase adopt** — after install; or use [Assistant UI](https://abx-git.github.io/agm.github.io/) |
| [core/system-prompt.md](./core/system-prompt.md) | IDE rules (installed by `bp-install.sh`) |
| [reference/adopt-procedure.md](./reference/adopt-procedure.md) | Agent adoption reference |
| [reference/maintenance-pipeline.md](./reference/maintenance-pipeline.md) | CI: render maintenance prompt with DIFF_FROM / DIFF_TO |
| [maintenance-diff-range-standalone.md](./maintenance-diff-range-standalone.md) | Copy-paste / pipeline session prompt |

Copy session prompts from the Assistant UI (doc-root aware) or from `prompts/workflows/<id>.md` after install.
