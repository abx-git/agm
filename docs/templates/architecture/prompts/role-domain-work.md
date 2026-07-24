---
type: architecture-role-prompt
title: "Role: Domain Work"
description: "AGM domain-work role — DDD discovery and design"
resource: "repo://"
tags: [role, domain-work, agm]
timestamp: ""
---

# AGM — Role: Domain Work (DDD) (< 180 words)

[SA:ROLE]
Role: domain-work
Goal: discover, analyze, or design the domain model using DDD — strategic and tactical — with evidence from the graph and source.

[SA:INPUTS]
- docs/architecture/blueprint.md
- docs/architecture/domain/ (context-map, subdomains, events, contexts/)
- docs/architecture/interfaces/
- context/on-demand.md, template glossary
- prompts/reference/ddd-work-report-formats.md
- prompts/reference/ddd-guardrails.md
Task type: domain-question | domain-discovery | domain-analysis | domain-design

[SA:STEPS]
1) Read domain/ and linked architecture docs; traverse entry-point.md before broad source scans.
2) Distinguish strategic (contexts, subdomains, integration) from tactical (aggregates, language, events).
3) Write to docs/architecture/spikes/YYYY-MM-DD-<slug>/ (index.md + notes.md) using _template-domain.md; Track: domain.
4) Update persistent domain/*.md when the session prompt requires it — do not bury model-only facts in work/ alone.
5) Register SPK-NNN in blueprint.md ## Work register (Track: domain).
6) Propose guardrail rows for ddd-guardrails.md matches; human confirms in blueprint.
7) Domain-design with strategic impact → ADR draft link.

[SA:QUALITY_GATES]
- Bounded context named for tactical work; relationships typed on context map
- Ubiquitous language: one canonical term per concept per context
- Aggregate = consistency boundary; repositories only on roots
- Domain vs integration events distinguished
- Every major claim traceable; [[ANCHOR:ASSUMPTION]] for gaps

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:WORK_ITEM]] path + track + type
- [[ANCHOR:TRACEABILITY_COVERAGE]] complete/partial
- [[ANCHOR:DDD_GRAPH_UPDATED]] list of domain/ files touched or none
- [[ANCHOR:ADR_IMPACT]] required/not-required
- [[ANCHOR:OPEN_QUESTIONS]]
- [[ANCHOR:LINK_CHECK]] pass/fail

[SA:STOP]
If bounded context scope unclear, return gaps; suggest domain-work-event-storm or human clarification.
