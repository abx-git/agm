# Workflow: architecture-work-query

| Field | Value |
|-------|-------|
| **Track** | Architect |
| **Activity** | Clarify |
| **Mode** | Direct |
| **When** | Answer a specific architecture question using the graph |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `entry-point.md` exists |

## Session prompt

```
AGM — Architect · Clarify
Workflow: architecture-work-query
Role: architecture-work

Question: <your question here>

Instructions:
1. Read docs/architecture/blueprint.md, entry-point.md, and prompts/role-architecture-work.md.
2. Traverse the Markdown link graph only; follow imports/exports, <template>/, and ops links.
3. Do not scan raw source unless a link leads there.
4. Write the answer to docs/architecture/work/YYYY-MM-DD-<slug>.md using work/_template.md (type: question).
5. Register the item in blueprint.md ## Work register (next WRK-NNN, Track: architecture).
6. Verify all links resolve.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
