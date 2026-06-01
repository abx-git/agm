# Architecture Work — Guide

Use the compiled Blueprint graph to **answer questions**, run **analyses**, and produce **designs** — without rescanning the entire codebase. Results are stored as Markdown in `docs/architecture/work/` and registered in `blueprint.md`.

This phase requires a completed or partially completed Bootstrap (arc42 sections and interface contracts exist). On large core systems, keep investing in **Refinement** in parallel — Architecture Work is most reliable when the underlying graph stays current.

---

## When to use

| Situation | Mode | Output |
|-----------|------|--------|
| *"How does X connect to Y?"* | **Query** | Answer with traceable links |
| *"What are the risks of our payment integration?"* | **Analysis** | Structured findings |
| *"Design circuit breaker for payment calls"* | **Design** | Proposal + optional ADR draft |

---

## Folder structure

```
docs/architecture/
├── blueprint.md
├── entry-point.md
├── work/                              ← Architecture Work outputs
│   ├── README.md                      ← index (optional, agent-maintained)
│   ├── _template.md                   ← copy for new work items
│   └── YYYY-MM-DD-<short-slug>.md     ← one file per work item
├── interfaces/
└── arc42/
```

### File naming

- Format: `YYYY-MM-DD-<short-slug>.md` (e.g. `2026-05-31-payment-circuit-breaker-design.md`)
- Slug: lowercase, hyphens, max ~50 characters
- One topic per file; supersede old items by setting status `superseded` and linking to the replacement

### Work item ID

Register each file in `blueprint.md` under `## Architecture work` with ID `WRK-NNN` (sequential per application).

---

## Work item types

| Type | Purpose | Typical sections used |
|------|---------|------------------------|
| `question` | Answer a specific architecture question | Context, Answer, Traceability |
| `analysis` | Evaluate structure, risks, quality, coupling | Context, Findings, Recommendations |
| `design` | Propose a target architecture or change | Context, Design, Alternatives, Impact, ADR link |

---

## Rules for agents

1. **Read `blueprint.md` and `entry-point.md` first** — then traverse only via Markdown links.
2. **Do not duplicate** arc42 or interface contract content — link to it.
3. **Every claim** must appear in the Traceability table with a link to source (arc42 file, `exports.md`, or source file).
4. **Write output** to `docs/architecture/work/` and **update** `blueprint.md` before stopping.
5. If a design implies an architectural decision, **draft an ADR** in `arc42/decisions/` and cross-link.
6. Run referential integrity check on all new links.

---

## Relationship to other operations

| Operation | Architecture Work |
|-----------|-------------------|
| Bootstrap | Prerequisite — creates the graph to traverse |
| Refinement | Updates arc42 when documentation was thin; Work may trigger Refinement |
| Maintenance | Updates arc42 after code changes; Work does not replace Maintenance |
| ADR | Design work may produce ADR drafts for human review |

---

## Human review

Architecture Work outputs are **drafts for review**. The architect approves, rejects, or promotes findings into arc42, ADRs, or backlog items.

---

See [PROMPT.md](./PROMPT.md#4-architecture-work-prompts) for copy-paste prompts.
