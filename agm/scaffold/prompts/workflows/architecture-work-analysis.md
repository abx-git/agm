# Workflow: architecture-work-analysis

| Field | Value |
|-------|-------|
| **Track** | Architect |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | Structured analysis (risks, coupling, quality) |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
AGM — Architect · Evaluate
Workflow: architecture-work-analysis
Role: architecture-work

Topic: <e.g. payment integration resilience>
Scope: <modules, services, or <template> sections>
Focus: <e.g. coupling, failure modes, security, performance>

Instructions:
1. Read blueprint.md and traverse the graph from entry-point.md.
2. Produce a structured analysis in <doc-root>/process/spikes/YYYY-MM-DD-<slug>/notes.md
   (type: analysis): Context, Findings, Recommendations, Traceability.
3. Link to existing guardrail findings in blueprint.md if relevant.
4. Register in blueprint.md (SPK-NNN, ## Spike register). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:LINK_CHECK]] before stop.
```
