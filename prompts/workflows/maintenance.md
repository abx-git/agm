# Workflow: maintenance

| Field | Value |
|-------|-------|
| **When** | After code changes; same PR or follow-up session |
| **Role** | `maintenance` |
| **Fresh session** | Optional |

## Session prompt

```
Blueprint Pattern — Maintenance.
Workflow: maintenance
Role: maintenance

Read docs/architecture/context/always-on.md → docs/architecture/blueprint.md → docs/architecture/prompts/role-maintenance.md.

Git diff:
<paste git diff or PR diff summary>

Update only architecture docs impacted by this diff.
If **Documentation focus (evolve)** is present, include docs for those orientations when the diff affects them.

Output [[ANCHOR:CHANGE_CLASSIFICATION]], [[ANCHOR:CHANGED_DOCS]], [[ANCHOR:INTERFACE_IMPACT]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
