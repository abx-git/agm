# Workflow: review-maintenance

| Field | Value |
|-------|-------|
| **Track** | Verify |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | After a maintenance run |
| **Role** | `review` |
| **Fresh session** | **Required** |

## Session prompt

```
AGM — Verify · Evaluate (post-sync)
Role: review

Review AGM documentation for this application.
Review type: maintenance

Cross-check only files changed in the last maintenance run against the git diff.
Do not fix issues — report only.

Output [[ANCHOR:REVIEW_SCOPE]], [[ANCHOR:VERDICT]], [[ANCHOR:FINDINGS]], [[ANCHOR:LINK_CHECK]] before stop.
Create <doc-root>/process/reviews/YYYY-MM-DD-maintenance-<slug>/ from process/reviews/_template/ (index.md, report.md, findings.md). Assign next REV-NNN. Update ## Reviews in blueprint.md.
```
