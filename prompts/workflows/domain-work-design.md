# Workflow: domain-work-design

| Field | Value |
|-------|-------|
| **Track** | Domain |
| **Activity** | Design |
| **Mode** | Direct |
| **When** | Domain model or boundary design (aggregates, ACL, context split) |
| **Role** | `domain-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; context map recommended for cross-context designs |

## Session prompt

```
AGM — Domain · Design
Workflow: domain-work-design
Role: domain-work

Goal: <e.g. split Order aggregate, introduce ACL to payment context, model refund policy>
Bounded context: <context name or cross-cutting>
Constraints: <optional>

Report format: prompts/reference/ddd-work-report-formats.md § Domain design

Instructions:
1. Read domain/, relevant spikes/ and legacy work/ items, interfaces/, template decisions/.
2. Write design to <doc-root>spikes/YYYY-MM-DD-<slug>/notes.md (type: domain-design): model, aggregates, events, integration impact.
3. Draft updates to domain/contexts/<context>/model.md (link from work item).
4. Strategic boundary change → draft ADR in <template>/decisions/ and update context-map.md.
5. Register SPK (Track: domain). Verify links.

Output [[ANCHOR:SPIKE]] (alias WORK_ITEM), [[ANCHOR:DDD_GRAPH_UPDATED]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:ADR_IMPACT]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
