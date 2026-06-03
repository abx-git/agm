# Workflow: architecture-work-analysis

| Field | Value |
|-------|-------|
| **When** | Structured analysis (risks, coupling, quality) |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
Blueprint Pattern — Architecture Work (analysis).
Workflow: architecture-work-analysis
Role: architecture-work

Topic: <e.g. payment integration resilience>
Scope: <modules, services, or arc42 sections>
Focus: <e.g. coupling, failure modes, security, performance>

Instructions:
1. Read blueprint.md and traverse the graph from entry-point.md.
2. Produce a structured analysis in docs/architecture/work/YYYY-MM-DD-<slug>.md
   (type: analysis): Context, Findings, Recommendations, Traceability.
3. Link to existing guardrail findings in blueprint.md if relevant.
4. Register in blueprint.md (WRK-NNN). Verify links.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
