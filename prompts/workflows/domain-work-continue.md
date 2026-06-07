# Workflow: domain-work-continue

| Field | Value |
|-------|-------|
| **When** | Resume open domain WRK items |
| **Role** | `domain-work` |
| **Fresh session** | Optional |

## Session prompt

```
AGM — continue Domain Work.
Workflow: domain-work-continue
Role: domain-work

Read <doc-root>blueprint.md ## Work register.
Pick the next item with Track: domain and status draft, or continue the domain task the human names.
Update domain/ graph files and work item before stopping.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
