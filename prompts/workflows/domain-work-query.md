# Workflow: domain-work-query

| Field | Value |
|-------|-------|
| **When** | Answer a domain / DDD question using the graph |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
AGM — Domain Work (query).
Workflow: domain-work-query
Role: domain-work

Question: <your domain question here>

Instructions:
1. Read blueprint.md, domain/, entry-point.md, prompts/role-domain-work.md.
2. Traverse Markdown graph; prefer domain/, glossary, interfaces/, contexts/ over raw source.
3. Write answer to <doc-root>work/YYYY-MM-DD-<slug>.md (type: domain-question) using _template-domain.md.
4. Register WRK (Track: domain). Verify links.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
