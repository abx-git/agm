# Workflow: review-milestone

| Field | Value |
|-------|-------|
| **Track** | Verify |
| **Activity** | Evaluate |
| **Mode** | Direct |
| **When** | After Bootstrap milestone — close creation |
| **Role** | `review` |
| **Fresh session** | **Required** |

## Session prompt

```
AGM — Verify · Evaluate (milestone)
Workflow: review-milestone
Role: review

Review AGM documentation for this application.
Review type: milestone (bootstrap close)

Focus:
1. Validate <doc-root>/blueprint.md — phase states, Spike register (SPK; legacy WRK ok), session log, and open items match the actual documentation graph.
2. Cross-check the full <doc-root>/ graph for consistency, stale content, and broken relative links.
3. From bootstrap follow-up sessions: find insights still only in spikes/ (or legacy work/) files or the session log that belong in template sections (arc42, c4-light, etc.). Recommend where to link or summarize them — report-only; do not rewrite architecture docs in this session.

Report-only. Write report under <doc-root>/spikes/. Update blueprint.md ## Reviews.

Output [[ANCHOR:REVIEW_SCOPE]], [[ANCHOR:VERDICT]], [[ANCHOR:FINDINGS]], [[ANCHOR:TOP_RISKS]], [[ANCHOR:LINK_CHECK]] before stop.
```
