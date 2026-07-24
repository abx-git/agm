# Workflow: architecture-work-design

| Field | Value |
|-------|-------|
| **Track** | Architect |
| **Activity** | Design |
| **Mode** | Direct |
| **When** | Architecture design proposal |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done` |

## Session prompt

```
AGM — Architect · Design
Workflow: architecture-work-design
Role: architecture-work

Goal: <e.g. add circuit breaker between order-service and payment-service>
Constraints: <optional: latency, no new infra, etc.>

Instructions:
1. Read blueprint.md and relevant spikes/ and legacy work/ items and <template> sections.
2. Write design to docs/architecture/spikes/YYYY-MM-DD-<slug>/notes.md (type: design):
   Context, Design (with Mermaid), Alternatives, Impact, Traceability.
3. If the design implies a decision, draft ADR in <template>/decisions/ and cross-link.
4. Register in blueprint.md (SPK-NNN, ## Spike register). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:ADR_IMPACT]], [[ANCHOR:LINK_CHECK]] before stop.
```
