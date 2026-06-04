# Workflow: bootstrap-continue

| Field | Value |
|-------|-------|
| **When** | Resume blueprint phases after Bootstrap phase 0 is `[x] done` |
| **Role** | `bootstrap` |
| **Fresh session** | Optional |

## Session prompt

```
Blueprint Pattern — Bootstrap (continue).
Workflow: bootstrap-continue
Role: bootstrap

Follow Blueprint Pattern core prompt and docs/architecture/prompts/role-bootstrap.md.
Read docs/architecture/context/always-on.md → docs/architecture/blueprint.md.
Resume the next [~] or [ ] phase.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
