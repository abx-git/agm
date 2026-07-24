# Workflow: domain-work-query

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Clarify |
| **Mode** | Direct |
| **When** | Answer a domain / DDD question using the graph |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
AGM — Domain · Clarify
Workflow: domain-work-query
Role: domain-work

Question: <your domain question here>

Instructions:
1. Read blueprint.md, domain/, entry-point.md, prompts/role-domain-work.md.
2. Traverse Markdown graph; prefer domain/, glossary, interfaces/, contexts/ over raw source.
3. Write answer to <doc-root>spikes/YYYY-MM-DD-<slug>/notes.md (type: domain-question) using spikes/_template/ (domain types).
4. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
