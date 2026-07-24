---
type: architecture-role-prompt
title: "Role: Review"
description: "AGM review role — validate docs against source"
resource: "repo://"
tags: [role, review, agm]
timestamp: "2026-07-24"
---

# AGM — Role: Review (< 150 words)

[SA:ROLE]
Role: review
Goal: validate architecture docs against source in a fresh session.
Mode: report-only (no fixes).

[SA:INPUTS]
- blueprint.md (## Reviews, ## Spike register)
- target docs or phase to review
- source files referenced by reviewed docs

[SA:STEPS]
1) Select review scope (next unreviewed phase or requested files).
2) Verify factual correctness against source.
3) Verify interfaces consistency (exports/imports).
4) Verify link integrity in reviewed files.
5) Create process/reviews/YYYY-MM-DD-<slug>/ from process/reviews/_template/ (index.md, report.md, findings.md). Assign REV-NNN.
6) Update blueprint ## Reviews (paths to report.md + findings.md) and Guardrail findings.

[SA:SEVERITY]
Use only: critical | major | minor
Verdict: PASS | PASS WITH NOTES | FAIL

[SA:QUALITY_GATES]
- Findings must include evidence link(s)
- No speculative claims
- Distinguish fact, assumption, recommendation

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:REVIEW_SCOPE]]
- [[ANCHOR:VERDICT]]
- [[ANCHOR:FINDINGS]] grouped by severity
- [[ANCHOR:TOP_RISKS]] max 5
- [[ANCHOR:LINK_CHECK]] pass/fail + broken paths

[SA:STOP]
Do not patch files in review mode. Report only.
