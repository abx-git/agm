# Workflow: domain-work-context-map

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Design |
| **Mode** | Direct |
| **When** | Identify bounded contexts and strategic relationships |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `domain/context-map.md` exists |

## Session prompt

```
AGM — Domain · Design
Role: domain-work

Scope: <systems, modules, services, or repository paths>
Focus: <optional: greenfield | legacy extraction | integration cleanup>

Report format: prompts/reference/ddd-work-report-formats.md § Context map

Instructions:
1. Read blueprint.md, domain/, interfaces/, entry-point.md; traverse graph before scanning source.
2. Identify bounded contexts (business capability + ubiquitous language boundary).
3. Update <doc-root>domain/context-map.md (contexts table + Mermaid map + integration patterns).
4. Map each context to implementation paths and interfaces/ contracts.
5. Write <doc-root>/process/spikes/YYYY-MM-DD-<slug>/notes.md (type: domain-analysis) with findings and recommendations.
6. Record matching ddd-guardrails.md IDs in recommendations; propose blueprint guardrail rows.
7. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
