# Blueprint Pattern — Prompts & Blueprint File

This file contains everything you need to apply the Blueprint Pattern in your repository:

1. [System Prompt](#1-system-prompt) — paste into your AI coding assistant
2. [Blueprint File Format](#2-blueprint-file-format) — reference format for `blueprint.md`
3. [Session-Start Prompts](#3-session-start-prompts) — use at the beginning of every new session
4. [Architecture Work Prompts](#4-architecture-work-prompts) — query, analysis, design (requires Bootstrap)
5. [Review Prompts](#5-review-prompts) — generator–evaluator separation (requires Bootstrap)
6. [Base Context Setup](#6-base-context-setup) — automatic session orientation
7. [Extensions Guide](./docs/blueprint-pattern-extensions.md) — full rationale and field experience
8. [Architecture Work Guide](./docs/architecture-work-guide.md) — full method and folder structure

---

## 1. System prompt

Paste this into your AI coding assistant's rules file:

- **Cursor** → `.cursor/rules/blueprint-pattern.mdc` (behavior) + `.cursor/rules/blueprint-context.mdc` (knowledge)
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

Prefer arc42 as the documentation template and the C4 model as the diagramming language
when they fit the project. Neither is mandatory — teams may rename, merge, or omit sections —
but together they are a proven basis for structured architecture documentation. Render all
diagrams as inline Mermaid.js. Every component file contains direct backlinks to its source
files.

In arc42/introduction.md, include a **Documentation template** section that states whether
arc42/C4 are used and why; attribute
[arc42](https://arc42.org) (Gernot Starke, Peter Hruschka,
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)) and the
[C4 model](https://c4model.com/) (Simon Brown); note if official arc42 template wording
was reused or adapted. Application-specific content remains under the repository license —
not the arc42 template license.

Structural additions beyond arc42/C4:
- context/always-on.md — minimum orientation (also inject via tool rules; see PROMPT.md §6)
- context/on-demand.md — domain, pitfalls, environments (read when needed)
- interfaces/exports.md — unique IDs per API, Event, or Service this app provides
- interfaces/imports.md — relative Markdown links to partner exports.md files
- prompts/ — role extensions (bootstrap, maintenance, architecture-work, review)
- ops/ — operational knowledge (troubleshooting, pitfalls, runbooks; not arc42)
- work/ — Architecture Work and Review outputs; see work/_template.md

## Blueprint

docs/architecture/blueprint.md is the persistent work file across sessions.
It contains one item per arc42 section with state tracking, plus Architecture work and Reviews.

States: [ ] open · [~] in progress · [x] done · [!] blocked

Rules:
- At session start: read context/always-on.md (if injected) and Blueprint; resume from next [~] or [ ]
- Load docs/architecture/prompts/role-<name>.md when the user specifies a role
- At session end: update all touched states, append a session log entry (enhanced format when compacting)
- Never start without reading — never stop without updating

## Workflow

Bootstrap (only if no Blueprint exists):
Analyze file tree → copy templates from docs/templates/architecture/ (or create context/, prompts/, work/) →
derive phases from arc42 sections → create Blueprint with all phases [ ] → mark Bootstrap [x], begin Phase 1.
Populate context/always-on.md as you learn the system.

Execution (spec-driven development):
Read Blueprint → analyze source → write target file → referential integrity check →
update Blueprint → proceed or stop.

Maintenance:
On git diff, detect architectural impact, update affected arc42, interfaces, ops, and Blueprint
(idempotent generation). Use role-maintenance.md.

Architecture Work (after Bootstrap has entry-point and core arc42):
Answer questions, run analyses, or produce designs by traversing the Markdown graph only.
Write results to docs/architecture/work/YYYY-MM-DD-<slug>.md using work/_template.md.
Register each item in Blueprint under ## Architecture work (ID WRK-NNN).
Use role-architecture-work.md. Do not duplicate arc42 content — link to it.
Designs that imply decisions: draft ADR in arc42/decisions/ and cross-link.

Review (separate session from generation — fresh context):
Cross-check documentation against source. Use role-review.md.
Write report to work/YYYY-MM-DD-review-<slug>.md using work/_template-review.md.
Update blueprint.md ## Reviews. Do not fix issues — report only.
Register significant findings in ## Guardrail findings with Source: Review (YYYY-MM-DD).

Compaction:
Monitor context budget. When ≥2 arc42 phases completed, ≥15 source files read, ≥30 turns,
≥3 topic switches, or ≥2 referential integrity errors in sequence:
1. Update Blueprint session log with key decisions, open assumptions, compaction trigger, resume prompt
2. Recommend session break to the user
3. Do not continue past the trigger — quality degrades

## Architecture guardrails

While documenting, detect and surface:
- Applied patterns (GoF patterns, enterprise integration patterns after Hohpe/Woolf)
- Style deviations → record as ADR
- Structural smells (code smells after Fowler, coupling metrics, cyclic dependencies,
  SOLID principles)

Report inline under ### ⚠ Architecture notes. Summarize in Blueprint under
## Guardrail findings (Source: Guardrail (Phase N)).

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
| 13    | Operational Knowledge      | ops/                               | [ ] open       | —            |

States: `[ ]` open · `[~]` in progress · `[x]` done · `[!]` blocked

## Architecture work

| ID | Title | Type | File | Status | Date |
|----|-------|------|------|--------|------|
| —  | —     | —    | —    | —      | —    |

Types: `question` · `analysis` · `design`  
Status: `draft` · `reviewed` · `superseded`

## Reviews

| Phase / target | Reviewed | Verdict | Report | Findings |
|----------------|----------|---------|--------|----------|
| —              | —        | —       | —      | —        |

Verdict: `PASS` · `PASS WITH NOTES` · `FAIL`

## Guardrail findings

| File | Finding | Severity | Source |
|------|---------|----------|--------|
| —    | —       | —        | —      |

Source: `Guardrail (Phase N)` · `Review (YYYY-MM-DD)`

## Session log

### YYYY-MM-DD — Session N
- Completed: …
- Key decisions: …
- Open assumptions: …
- Compaction trigger: … (if applicable)
- Next: …
- Resume prompt: "Continue Blueprint Pattern. Role: …. Read blueprint.md. …"
```

---

## 3. Session-start prompts

Use at the beginning of every new conversation. Specify a **role** so the agent loads the matching file from `docs/architecture/prompts/`.

### 3a. Continue documentation (default)

```
Continue Blueprint Pattern documentation for this application.
Role: bootstrap

Read docs/architecture/blueprint.md, resume from the next [~] or [ ] phase.
Load docs/architecture/prompts/role-bootstrap.md.
Update Blueprint state and session log after each phase. Update Blueprint before stopping.
```

Roles: `bootstrap` · `maintenance` · `architecture-work` · `review`

### 3b. Maintenance

```
Continue Blueprint Pattern documentation for this application.
Role: maintenance

Read docs/architecture/blueprint.md and docs/architecture/prompts/role-maintenance.md.
Process the git diff: <paste or describe diff>.
Update only affected documentation. Update Blueprint before stopping.
```

### 3c. Architecture Work

```
Continue Blueprint Pattern documentation for this application.
Role: architecture-work

Read docs/architecture/blueprint.md and docs/architecture/prompts/role-architecture-work.md.
<your question or task>
```

---

## 4. Architecture Work prompts

Prerequisite: `docs/architecture/entry-point.md` exists and Bootstrap phase 0 is `[x] done`.

Copy `work/_template.md` from the [sample application](./docs/examples/sample-app/order-service/docs/architecture/work/_template.md) if `work/` does not exist yet.

### 4a. Query — answer an architecture question

```
Blueprint Pattern — Architecture Work (query).
Role: architecture-work

Question: <your question here>

Instructions:
1. Read docs/architecture/blueprint.md, entry-point.md, and prompts/role-architecture-work.md.
2. Traverse the Markdown link graph only; follow imports/exports, arc42, and ops links.
3. Do not scan raw source unless a link leads there.
4. Write the answer to docs/architecture/work/YYYY-MM-DD-<slug>.md using work/_template.md
   (type: question).
5. Register the item in blueprint.md under ## Architecture work (next WRK-NNN).
6. Verify all links resolve.
```

**Example:**

```
Blueprint Pattern — Architecture Work (query).
Role: architecture-work

Question: How does order-service connect to payment-service when a customer places an order?

Instructions: (as above)
```

### 4b. Analysis — structured architecture analysis

```
Blueprint Pattern — Architecture Work (analysis).
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
```

### 4c. Design — architecture design proposal

```
Blueprint Pattern — Architecture Work (design).
Role: architecture-work

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
Role: architecture-work

Read docs/architecture/blueprint.md ## Architecture work.
Pick the next item with status draft, or start a new query/analysis/design if requested.
Update the work file and blueprint before stopping.
```

---

## 5. Review prompts

Prerequisite: Bootstrap complete enough to review target files. Run in a **fresh session** (no generation context).

Copy `work/_template-review.md` from [templates](./docs/templates/architecture/work/_template-review.md).

### 5a. Phase review

```
Review Blueprint Pattern documentation for this application.
Role: review

Read docs/architecture/blueprint.md and docs/architecture/prompts/role-review.md.
Select the next arc42 phase without a verdict in ## Reviews.
Cross-check the target file against source code.
Write the report to docs/architecture/work/YYYY-MM-DD-review-<slug>.md.
Update blueprint.md ## Reviews and ## Guardrail findings (Source: Review). Do not fix issues.
```

### 5b. Milestone review (after Bootstrap)

```
Review Blueprint Pattern documentation for this application.
Role: review

Review type: milestone
Cross-check the full docs/architecture/ graph for consistency and stale content.
Write report to work/. Update blueprint.md ## Reviews.
```

### 5c. Maintenance review

```
Review Blueprint Pattern documentation for this application.
Role: review

Review type: maintenance
Cross-check only files changed in the last maintenance run against the git diff.
Do not fix issues — report only.
```

---

## 6. Base context setup

**Behavior** lives in the [system prompt](#1-system-prompt). **Knowledge** lives in `docs/architecture/context/`.

1. Copy [always-on.md](./docs/templates/architecture/context/always-on.md) → `docs/architecture/context/always-on.md`
2. Copy [on-demand.md](./docs/templates/architecture/context/on-demand.md) → `docs/architecture/context/on-demand.md`
3. Fill in app identity, source map, and session protocol during Bootstrap
4. Wire into your tool:

| Tool | Action |
|------|--------|
| **Cursor** | Create `.cursor/rules/blueprint-context.mdc` with `alwaysApply: true`; include or `@`-link `always-on.md` |
| **Claude Code** | Append a short summary + link to `always-on.md` in `CLAUDE.md` |
| **Amazon Q** | Copy to `.amazonq/rules/blueprint-context.md` |
| **GitHub Copilot** | Append to `.github/copilot-instructions.md` |

Copy role prompts from [docs/templates/architecture/prompts/](./docs/templates/architecture/prompts/) → `docs/architecture/prompts/`.

See [Extensions guide](./docs/blueprint-pattern-extensions.md) for rationale.

---

## Referential integrity — CI enforcement

The agent performs referential integrity checks during every session. For mechanical
enforcement independent of the agent, add a Markdown link checker to your CI pipeline.

This repository includes a ready-to-use workflow at [`.github/workflows/blueprint-pattern-integrity.yml`](./.github/workflows/blueprint-pattern-integrity.yml) and configuration at [`.mlc-config.json`](./.mlc-config.json).

This ensures broken backlinks are caught at the pull request level, not only when
an agent session runs.
