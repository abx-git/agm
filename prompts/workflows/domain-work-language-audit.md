# Workflow: domain-work-language-audit

| Field | Value |
|-------|-------|
| **When** | Ubiquitous language audit (docs vs code vs APIs) |
| **Role** | `domain-work` |
| **Prerequisite** | Glossary or domain/contexts/*/language.md partially populated |

## Session prompt

```
AGM — Domain Work (language audit).
Workflow: domain-work-language-audit
Role: domain-work

Scope: <bounded context, service, or module paths>
Sources to compare: glossary, on-demand.md, domain/contexts/*/language.md, public API, type names in code

Report format: prompts/reference/ddd-work-report-formats.md § Language audit

Instructions:
1. Collect term inventory from domain language docs and template glossary.
2. Collect names from Scope source (types, modules, REST/event names) — follow graph links first.
3. Build mismatch matrix: synonym clusters, deprecated terms, technical leaks.
4. Recommend one canonical term per concept per context.
5. Apply agreed renames to language.md / glossary / on-demand.md only where human confirms in session; otherwise list in report.
6. Write work report (type: domain-analysis); flag DDD-T05, DDD-T06.
7. Register WRK (Track: domain). Verify links.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
