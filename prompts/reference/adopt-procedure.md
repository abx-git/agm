# Adoption procedure (agent reference)

Bundled into the standalone adoption prompt. **Write files directly** — no git clone, zip, curl, or checkout scripts.

## Phase A — Scaffold (write files)

Create at application repository root:

```
docs/architecture/
├── context/always-on.md      ← stub first; fill in Phase B
├── context/on-demand.md      ← minimal stub
├── prompts/
│   ├── role-bootstrap.md
│   ├── role-maintenance.md
│   ├── role-architecture-work.md
│   └── role-review.md
├── work/_template.md
├── work/_template-review.md
├── interfaces/exports.md     ← stub table
├── interfaces/imports.md     ← stub table
├── blueprint.md              ← construction plan; phase table in Phase C
├── entry-point.md            ← human entry; completed in Phase C
└── <template>/               ← arc42 (default) | c4-light | adr-first | lean-service
prompts/core/system-prompt.md ← core agent rules (see appendix A)
```

Rules:

- Create every path by **writing files in the repo** — do not download or clone.
- Role prompts: use the [SA:ROLE] structure from the Blueprint Pattern (appendix B); match the four role files under `docs/templates/architecture/prompts/` in the pattern repository when you know them.
- Template folder: default **arc42** unless the human chooses otherwise; create chapter stubs with titles and placeholder sections.
- Do not create `scripts/bp-workflow.sh`, `prompts/workflows/`, or `ACTIVE.md` — session tasks are pasted per chat.

## Phase B — Configure

If the session prompt includes an **Adoption parameters** block (with **File roles**), create three separate files — do not merge:

| File | Write |
|------|-------|
| `context/always-on.md` | Session context from parameters; interview only for gaps |
| `blueprint.md` | Construction plan: phase rows for selected template, initial `[ ]` / `[~]` states |
| `entry-point.md` | Overview stub, navigation table, links to template sections and source paths |

Remind the human to paste `prompts/core/system-prompt.md` into IDE rules (once).

## Phase C — Bootstrap

Follow `docs/architecture/prompts/role-bootstrap.md`:

- Record template in `entry-point.md`.
- Populate `blueprint.md` phase table; mark first in-progress phase.
- Populate interfaces/ and the first high-value section from evidence only.
- Keep blueprint (plan/progress) and entry-point (navigation) in sync.
- Session log + required anchors at end.

## Lifecycle after Build (phase 1)

| Phase | Action |
|-------|--------|
| **1 · Build** (continue) | `bootstrap-continue` until phases done → `review-milestone` |
| **2 · Evolve** | `refinement`, `maintenance` (+ git diff) |
| **3 · Work** | `architecture-work-query`, `-analysis`, `-design`, `-continue` |
| **Review** (any phase) | `review-phase`, `review-maintenance` — report-only, new chat |

No checkout command — copy the session prompt only.

---

## Appendix A — Core prompt (write to `prompts/core/system-prompt.md`)

```
# Blueprint Pattern — Core Prompt

You maintain architecture documentation for this repository using the Blueprint Pattern.

[SA:MODE]
You are a human-in-the-loop architecture scribe. Do not act autonomously.

[SA:READ_ORDER]
At session start, read in this order:
1) docs/architecture/context/always-on.md
2) docs/architecture/blueprint.md
3) This chat's session prompt (Workflow / Role lines)
4) docs/architecture/prompts/role-<role>.md

[SA:INVARIANTS]
- Markdown graph with relative links only
- Blueprint state in docs/architecture/blueprint.md
- Interface contracts in interfaces/exports.md and interfaces/imports.md
- Verify links before stopping

[SA:TEMPLATE]
arc42 | c4-light | adr-first | lean-service | custom — record in entry-point.md

[SA:EVIDENCE]
Mark uncertainty with [[ANCHOR:ASSUMPTION]]. Link claims to docs or source.

[SA:CHECKPOINT]
Output anchors required by the session prompt. Update blueprint.md session log.
```

## Appendix B — Role prompt shape

Each `docs/architecture/prompts/role-*.md` file uses: `[SA:ROLE]`, `[SA:INPUTS]`, `[SA:STEPS]`, `[SA:QUALITY_GATES]`, `[SA:OUTPUT_CONTRACT]`, `[SA:STOP]`. Copy content from the pattern repository templates or equivalent Bootstrap / Maintenance / Architecture Work / Review procedures.
