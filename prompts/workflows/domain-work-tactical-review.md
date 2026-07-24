# Workflow: domain-work-tactical-review

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | Tactical DDD review (aggregates, invariants, events, repositories) |
| **Role** | `domain-work` |
| **Prerequisite** | Bounded context identified; `domain/contexts/<context>/model.md` recommended |

## Session prompt

```
AGM — Domain · Evaluate
Workflow: domain-work-tactical-review
Role: domain-work

Bounded context: <context name>
Scope: <source paths for this context>
Compare to model doc: <yes | no>

Report format: prompts/reference/ddd-work-report-formats.md § Tactical review

Instructions:
1. Read domain/contexts/<context>/model.md and language.md if present; traverse from entry-point.md.
2. Inspect source under Scope for aggregate roots, entities, VOs, repositories, domain services, events.
3. Check: consistency boundaries, anemic model, repository scope, domain vs integration events.
4. Map findings to ddd-guardrails.md tactical IDs (DDD-T01–T08).
5. Propose updates to model.md and events.md where evidence supports.
6. Write work report (type: domain-analysis).
7. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
