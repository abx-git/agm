# Workflow: domain-work-integration-review

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | Review cross-context integration against DDD patterns |
| **Role** | `domain-work` |
| **Prerequisite** | `interfaces/` and preferably `domain/context-map.md` populated |

## Session prompt

```
AGM — Domain · Evaluate
Workflow: domain-work-integration-review
Role: domain-work

Scope: <cross-service integrations, API surface, or named context pair>

Report format: prompts/reference/ddd-work-report-formats.md § Integration review

Instructions:
1. Read domain/context-map.md, interfaces/exports.md, interfaces/imports.md, ecosystem-index if present.
2. For each integration, classify pattern: ACL, OHS, conformist, partnership, shared kernel, separate ways.
3. Contrast documented context map relationships with actual contracts.
4. Flag ddd-guardrails.md strategic smells (DDD-S01–S06).
5. Update context-map.md relationship table if corrections are evidence-based.
6. Write work report (type: domain-analysis) with prioritized recommendations.
7. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:ADR_IMPACT]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
