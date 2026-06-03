# Workflow: refinement

| Field | Value |
|-------|-------|
| **When** | Targeted deepening of specific arc42 sections (ongoing on large systems) |
| **Role** | `bootstrap` (same role file; scoped steps) |
| **Fresh session** | Optional |

## Session prompt

```
Blueprint Pattern — Refinement.
Workflow: refinement
Role: bootstrap

Goal: <e.g. extend arc42/runtime.md with retry and circuit-breaker behavior in payment processing>

Scope: <arc42 paths, modules, or blueprint phase numbers>

Follow docs/architecture/prompts/role-bootstrap.md for evidence and link rules.
Read always-on.md → blueprint.md. Update only the scoped sections and blueprint states.
Do not restart unrelated phases.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
