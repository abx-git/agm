# Workflow: architecture-work-continue

| Field | Value |
|-------|-------|
| **Track** | Architect |
| **Activity** | Continue |
| **Mode** | Direct |
| **When** | Resume open SPK (or legacy WRK) items in blueprint.md |
| **Role** | `architecture-work` |

## Session prompt

```
AGM — Architect · Continue
Workflow: architecture-work-continue
Role: architecture-work

Read <doc-root>/blueprint.md ## Spike register (or legacy ## Work register / ## Architecture work).
Pick the next item with Track: architecture (or untagged legacy row) and status draft, or start a new query/analysis/design if requested.
Update the spike folder (notes.md) or legacy work file and blueprint before stopping.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
