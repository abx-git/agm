# Workflow: domain-work-subdomain-classification

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Clarify |
| **Mode** | Direct |
| **When** | Classify subdomains (core / supporting / generic) for investment |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
AGM — Domain · Clarify
Role: domain-work

Business scope: <product line, platform, or enterprise area>
Evidence: <doc-root>domain/context-map.md, subdomains.md, arc42 introduction/strategy if present>

Report format: prompts/reference/ddd-work-report-formats.md § Subdomain classification

Instructions:
1. Read domain/, blueprint.md, entry-point.md; link to business goals in template docs.
2. Inventory subdomains (finer-grained than bounded contexts where helpful).
3. Classify each: core | supporting | generic with explicit rationale.
4. Update <doc-root>domain/subdomains.md.
5. Write work report (type: domain-analysis) with investment implications.
6. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
