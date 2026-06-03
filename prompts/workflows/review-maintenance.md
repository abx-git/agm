# Workflow: review-maintenance

| Field | Value |
|-------|-------|
| **When** | After a maintenance run |
| **Role** | `review` |
| **Fresh session** | **Required** |

## Session prompt

```
Blueprint Pattern — Review (maintenance).
Workflow: review-maintenance
Role: review

Review Blueprint Pattern documentation for this application.
Review type: maintenance

Cross-check only files changed in the last maintenance run against the git diff.
Do not fix issues — report only.

Output [[ANCHOR:REVIEW_SCOPE]], [[ANCHOR:VERDICT]], [[ANCHOR:FINDINGS]], [[ANCHOR:LINK_CHECK]] before stop.
```
