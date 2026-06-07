# Workflow: architecture-work-continue

| Field | Value |
|-------|-------|
| **When** | Resume open WRK items in blueprint.md |
| **Role** | `architecture-work` |

## Session prompt

```
AGM — continue Architecture Work.
Workflow: architecture-work-continue
Role: architecture-work

Read docs/architecture/blueprint.md ## Work register (or ## Architecture work).
Pick the next item with Track: architecture (or untagged legacy row) and status draft, or start a new query/analysis/design if requested.
Update the work file and blueprint before stopping.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
