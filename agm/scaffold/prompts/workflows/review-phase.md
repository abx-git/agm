# Workflow: review-phase

| Field | Value |
|-------|-------|
| **Track** | Verify |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | After each blueprint phase; verify one phase |
| **Role** | `review` |
| **Fresh session** | **Required** (no generation context) |

## Session prompt

```
AGM — Verify · Evaluate
Workflow: review-phase
Role: review

Read <doc-root>/context/always-on.md → <doc-root>/blueprint.md → <doc-root>/prompts/role-review.md.
Select next unreviewed phase in ## Reviews. Report-only — do not fix files.

Output [[ANCHOR:REVIEW_SCOPE]], [[ANCHOR:VERDICT]], [[ANCHOR:FINDINGS]], [[ANCHOR:TOP_RISKS]], [[ANCHOR:LINK_CHECK]] before stop.
Write <doc-root>/spikes/YYYY-MM-DD-review-<slug>/notes.md. Update ## Reviews and ## Guardrail findings in blueprint.md.
```
