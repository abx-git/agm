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
1. Read <doc-root>/blueprint.md, entry-point.md, and prompts/role-architecture-work.md.
2. Traverse the Markdown link graph only; follow imports/exports, <template>/, and ops links.
3. Do not scan raw source unless a link leads there.
4. Write the answer to <doc-root>/spikes/YYYY-MM-DD-<slug>/notes.md using spikes/_template/ (type: question).
5. Register the spike in blueprint.md ## Spike register (next SPK-NNN, Track: architecture).
6. Verify all links resolve.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
