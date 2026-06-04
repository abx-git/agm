# Workflow: refinement

| Field | Value |
|-------|-------|
| **When** | Targeted deepening of specific documentation sections (ongoing on large systems) |
| **Role** | `bootstrap` (same role file; scoped steps) |
| **Fresh session** | Optional |

## Session prompt

```
Blueprint Pattern — Refinement.
Workflow: refinement
Role: bootstrap

Goal: <goal>

Scope: <scope> (architecture **content** section — template file, interfaces/, ops/, or “next open row in blueprint.md”; not entry-point/always-on unless the human explicitly chose navigation/session setup)

Follow <doc-root>prompts/role-bootstrap.md for evidence and link rules.
Read always-on.md → blueprint.md. Update only the scoped sections and blueprint states.
If **Architecture documentation areas (evolve)** is present, update those Markdown areas within the stated scope (not prompts/ or workflows).
Do not restart unrelated phases.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
