# Workflow: review-phase

| Field | Value |
|-------|-------|
| **When** | After each arc42 phase; verify one phase |
| **Role** | `review` |
| **Fresh session** | **Required** (no generation context) |
| **Git branch** | `workflow/review-phase` |

## Session prompt

```
Blueprint Pattern — Review (phase).
Workflow: review-phase
Role: review

Read docs/architecture/context/always-on.md → docs/architecture/blueprint.md → docs/architecture/prompts/role-review.md.
Select next unreviewed phase in ## Reviews. Report-only — do not fix files.

Output [[ANCHOR:REVIEW_SCOPE]], [[ANCHOR:VERDICT]], [[ANCHOR:FINDINGS]], [[ANCHOR:TOP_RISKS]], [[ANCHOR:LINK_CHECK]] before stop.
Write work/YYYY-MM-DD-review-<slug>.md. Update ## Reviews and ## Guardrail findings in blueprint.md.
```
