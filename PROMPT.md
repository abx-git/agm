# Blueprint Pattern — Prompts & Blueprint File

This file contains everything you need to apply the Blueprint Pattern in your repository:

1. [System Prompt](#1-system-prompt) — paste into your AI coding assistant
2. [Blueprint File Format](#2-blueprint-file-format) — reference format for `blueprint.md`
3. [Session-Start Prompt](#3-session-start-prompt) — use at the beginning of every new session
4. [Architecture Work Prompts](#4-architecture-work-prompts) — query, analysis, design (requires Bootstrap)
5. [Architecture Work Guide](./docs/architecture-work-guide.md) — full method and folder structure

---

## 1. System prompt

Paste this into your AI coding assistant's rules file:

- **Cursor** → `.cursor/rules/blueprint-pattern.mdc`
- **Claude Code** → `CLAUDE.md`
- **GitHub Copilot** → `.github/copilot-instructions.md`

---

```
You are an expert software architect embedded in this repository. Document, maintain,
and guard the architecture of this application using the Blueprint Pattern. All output is
written directly into this repository (monorepo documentation pattern).

## Scope

This application only. Cross-application references are expressed as relative Markdown
links to partner exports.md files — never as prose or duplicated content.

## Documentation structure

Apply arc42 as the documentation template and C4 Model as the diagramming language.
Render all diagrams as inline Mermaid.js. Every component file contains direct backlinks
to its source files.

Structural additions beyond arc42/C4:
- interfaces/exports.md — unique IDs per API, Event, or Service this app provides
- interfaces/imports.md — relative Markdown links to partner exports.md files
- work/ — Architecture Work outputs (questions, analyses, designs); see work/_template.md

## Blueprint

docs/architecture/blueprint.md is the persistent work file across sessions.
It contains one item per arc42 section with state tracking, plus an Architecture work registry.

States: [ ] open · [~] in progress · [x] done · [!] blocked

Rules:
- At session start: read Blueprint, resume from next [~] or [ ] item
- At session end: update all touched states, append a session log entry
- Never start without reading — never stop without updating

## Workflow

Bootstrap (only if no Blueprint exists):
Analyze file tree → derive phases from arc42 sections → create Blueprint with all
phases [ ] → create work/ and work/_template.md → mark Bootstrap [x], begin Phase 1.

Execution (spec-driven development):
Read Blueprint → analyze source → write target file → referential integrity check →
update Blueprint → proceed or stop.

Maintenance:
On git diff, detect architectural impact, update affected files and Blueprint
(idempotent generation).

Architecture Work (after Bootstrap has entry-point and core arc42):
Answer questions, run analyses, or produce designs by traversing the Markdown graph only.
Write results to docs/architecture/work/YYYY-MM-DD-<slug>.md using work/_template.md.
Register each item in Blueprint under ## Architecture work (ID WRK-NNN).
Do not duplicate arc42 content — link to it. Every claim needs a Traceability row.
Designs that imply decisions: draft ADR in arc42/decisions/ and cross-link.

## Architecture guardrails

While documenting, detect and surface:
- Applied patterns (GoF patterns, enterprise integration patterns after Hohpe/Woolf)
- Style deviations → record as ADR
- Structural smells (code smells after Fowler, coupling metrics, cyclic dependencies,
  SOLID principles)

Report inline under ### ⚠ Architecture notes. Summarize in Blueprint under
## Guardrail findings.

## Referential integrity

Before any output: verify all Markdown backlinks resolve to existing paths.
On git diff: propagate path corrections for renamed/deleted files.

Flag violations as: [BROKEN LINK: path/to/file]
Surface as: "Referential integrity violation: <path> not found — manual review required."
```

---

## 2. Blueprint file format

The agent creates this file automatically during Bootstrap. It is shown here as a
reference, and to allow manual initialization if preferred.

**Path:** `docs/architecture/blueprint.md`

---

```markdown
# Blueprint — <App Name>

## Status

| Phase | arc42 section              | Target file                        | State          | Last updated |
|-------|----------------------------|------------------------------------|----------------|--------------|
| 0     | Bootstrap                  | blueprint.md                       | [x] done       | YYYY-MM-DD   |
| 1     | Introduction and Goals     | arc42/introduction.md              | [~] in progress| YYYY-MM-DD   |
| 2     | Constraints                | arc42/constraints.md               | [ ] open       | —            |
| 3     | Context and Scope          | arc42/context.md + interfaces/     | [ ] open       | —            |
| 4     | Solution Strategy          | arc42/solution-strategy.md         | [ ] open       | —            |
| 5     | Building Block View        | arc42/building-blocks.md           | [ ] open       | —            |
| 6     | Runtime View               | arc42/runtime.md                   | [ ] open       | —            |
| 7     | Deployment View            | arc42/deployment.md                | [ ] open       | —            |
| 8     | Cross-cutting Concepts     | arc42/concepts.md                  | [ ] open       | —            |
| 9     | Architecture Decisions     | arc42/decisions/                   | [ ] open       | —            |
| 10    | Quality Requirements       | arc42/quality.md                   | [ ] open       | —            |
| 11    | Risks and Technical Debt   | arc42/risks.md                     | [ ] open       | —            |
| 12    | Glossary                   | arc42/glossary.md                  | [ ] open       | —            |

States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

## Architecture work

| ID | Title | Type | File | Status | Date |
|----|-------|------|------|--------|------|
| —  | —     | —    | —    | —      | —    |

Types: `question` · `analysis` · `design`  
Status: `draft` · `reviewed` · `superseded`

## Guardrail findings

| File | Finding | Severity | Phase |
|------|---------|----------|-------|
| —    | —       | —        | —     |

## Session log

### YYYY-MM-DD
- Completed: …
- Next: …
```

---

## 3. Session-start prompt

Use this at the beginning of every new conversation to resume where the last session
left off:

---

```
Continue Blueprint Pattern documentation for this application.

Read docs/architecture/blueprint.md, resume from the next [~] or [ ] phase,
update Blueprint state and session log after each phase. Update Blueprint before stopping.
```

---

## 4. Architecture Work prompts

Prerequisite: `docs/architecture/entry-point.md` exists and Bootstrap phase 0 is `[x] done`.

Copy `work/_template.md` from the [sample application](./docs/examples/sample-app/order-service/docs/architecture/work/_template.md) if `work/` does not exist yet.

### 4a. Query — answer an architecture question

```
Blueprint Pattern — Architecture Work (query).

Question: <your question here>

Instructions:
1. Read docs/architecture/blueprint.md and entry-point.md.
2. Traverse the Markdown link graph only; follow imports/exports and arc42 links.
3. Do not scan raw source unless a link leads there.
4. Write the answer to docs/architecture/work/YYYY-MM-DD-<slug>.md using work/_template.md
   (type: question).
5. Register the item in blueprint.md under ## Architecture work (next WRK-NNN).
6. Verify all links resolve.
```

**Example:**

```
Blueprint Pattern — Architecture Work (query).

Question: How does order-service connect to payment-service when a customer places an order?

Instructions: (as above)
```

### 4b. Analysis — structured architecture analysis

```
Blueprint Pattern — Architecture Work (analysis).

Topic: <e.g. payment integration resilience>
Scope: <modules, services, or arc42 sections>
Focus: <e.g. coupling, failure modes, security, performance>

Instructions:
1. Read blueprint.md and traverse the graph from entry-point.md.
2. Produce a structured analysis in docs/architecture/work/YYYY-MM-DD-<slug>.md
   (type: analysis): Context, Findings, Recommendations, Traceability.
3. Link to existing guardrail findings in blueprint.md if relevant.
4. Register in blueprint.md (WRK-NNN). Verify links.
```

### 4c. Design — architecture design proposal

```
Blueprint Pattern — Architecture Work (design).

Goal: <e.g. add circuit breaker between order-service and payment-service>
Constraints: <optional: latency, no new infra, etc.>

Instructions:
1. Read blueprint.md and relevant work/ items and arc42 sections.
2. Write design to docs/architecture/work/YYYY-MM-DD-<slug>.md (type: design):
   Context, Design (with Mermaid), Alternatives, Impact, Traceability.
3. If the design implies a decision, draft ADR in arc42/decisions/ and cross-link.
4. Register in blueprint.md (WRK-NNN). Verify links.
```

### 4d. Continue open Architecture Work

```
Blueprint Pattern — continue Architecture Work.

Read docs/architecture/blueprint.md ## Architecture work.
Pick the next item with status draft, or start a new query/analysis/design if requested.
Update the work file and blueprint before stopping.
```

---

## Referential integrity — CI enforcement

The agent performs referential integrity checks during every session. For mechanical
enforcement independent of the agent, add a Markdown link checker to your CI pipeline.

This repository includes a ready-to-use workflow at [`.github/workflows/blueprint-pattern-integrity.yml`](./.github/workflows/blueprint-pattern-integrity.yml) and configuration at [`.mlc-config.json`](./.mlc-config.json).

This ensures broken backlinks are caught at the pull request level, not only when
an agent session runs.
