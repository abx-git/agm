# Workflow: architecture-work-continue

| Field | Value |
|-------|-------|
| **When** | Resume open WRK items in blueprint.md |
| **Role** | `architecture-work` |
| **Git branch** | `workflow/architecture-work-continue` |

## Session prompt

```
Blueprint Pattern — continue Architecture Work.
Workflow: architecture-work-continue
Role: architecture-work

Read docs/architecture/blueprint.md ## Architecture work.
Pick the next item with status draft, or start a new query/analysis/design if requested.
Update the work file and blueprint before stopping.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
