# DDD work report formats

Structured output for Domain Work (phase 4). Write to `docs/architecture/work/YYYY-MM-DD-<slug>.md` using [work/_template-domain.md](../../docs/templates/architecture/work/_template-domain.md).

Register in `blueprint.md` ## Work register with **Track:** `domain`.

## Shared rules

- Traverse `domain/`, `interfaces/`, template glossary, and `context/on-demand.md` before scanning source.
- Every major claim needs a trace link (doc or source path).
- Update persistent domain docs (`domain/*.md`, `domain/contexts/*/`) when the workflow goal includes graph maintenance — not only the work report.
- Reference guardrails from [ddd-guardrails.md](./ddd-guardrails.md) by ID when findings match.

---

## Event storm (domain-discovery)

**Workflow:** `domain-work-event-storm` · **Type:** `domain-discovery`

Sections: Context & scope · Event timeline (chronological) · Commands · Aggregates (candidates) · Policies & read models · Hot spots & open questions · Traceability

Deliverables: work report; optional updates to `domain/contexts/<context>/model.md` (draft) and `domain/events.md` (candidate events).

---

## Context map (domain-analysis)

**Workflow:** `domain-work-context-map` · **Type:** `domain-analysis`

Sections: Context · Identified bounded contexts · Context map (Mermaid) · Integration patterns per relationship · Team alignment · Findings · Recommendations · Traceability

Deliverable: update `domain/context-map.md` and work report. Link each context to modules/services and `interfaces/`.

---

## Subdomain classification (domain-analysis)

**Workflow:** `domain-work-subdomain-classification` · **Type:** `domain-analysis`

Sections: Context · Subdomain inventory · Classification (core / supporting / generic) · Rationale per subdomain · Investment implications · Traceability

Deliverable: update `domain/subdomains.md`.

---

## Integration review (domain-analysis)

**Workflow:** `domain-work-integration-review` · **Type:** `domain-analysis`

Sections: Context · Integration inventory (from `interfaces/`) · Pattern per link (ACL, OHS, conformist, partnership, shared kernel, separate ways) · Risks · Recommendations · Traceability

Cross-check: `domain/context-map.md` vs `interfaces/exports.md` and `imports.md`.

---

## Tactical review (domain-analysis)

**Workflow:** `domain-work-tactical-review` · **Type:** `domain-analysis`

Sections: Context & scope (bounded context) · Aggregate map · Invariants & consistency boundaries · Anemic model check · Repository boundaries · Domain vs integration events · Findings (guardrail IDs) · Recommendations · Traceability

Cross-check: `domain/contexts/<context>/model.md` vs source under scope.

---

## Language audit (domain-analysis)

**Workflow:** `domain-work-language-audit` · **Type:** `domain-analysis`

Sections: Context · Term inventory (glossary, on-demand, API, code) · Mismatch matrix · Synonym clusters · Recommendations (canonical term per concept) · Traceability

Deliverables: work report; proposed updates to glossary / `domain/contexts/*/language.md` / `context/on-demand.md`.

---

## Domain design (domain-design)

**Workflow:** `domain-work-design` · **Type:** `domain-design`

Sections: Context · Goal · Target model (Mermaid class or aggregate diagram) · Aggregate boundaries · Domain events · Integration impact · Alternatives · ADR link if strategic · Traceability

Update `domain/contexts/<context>/model.md` when design is accepted (draft in work item first).
