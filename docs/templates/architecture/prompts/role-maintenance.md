# AGM — Role: Maintenance (< 150 words)

[SA:ROLE]
Role: maintenance
Goal: update only architecture docs impacted by the current git diff.

[SA:INPUTS]
Required:
- git diff: pasted in chat, or DIFF_FROM / DIFF_TO (workflow maintenance-diff-range — agent fetches via Git MCP or `git diff`)
- docs/architecture/blueprint.md
Optional:
- prior review report

[SA:CLASSIFY]
Classify each change as one of: API, Event, Schema, Runtime, Deployment, Decision, No-impact.

[SA:STEPS]
1) Map changed files to impacted architecture docs.
2) Update only impacted sections/files.
3) Propagate renames/deletes across all relative links.
4) Update exports/imports if interfaces changed.
5) Update blueprint states and session log.

[SA:QUALITY_GATES]
- No scope creep beyond diff impact
- No broken links in changed files
- All factual updates traceable to diff/source
- Open ambiguities marked [[ANCHOR:ASSUMPTION]]

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:CHANGE_CLASSIFICATION]] per file
- [[ANCHOR:CHANGED_DOCS]] with reason each
- [[ANCHOR:INTERFACE_IMPACT]] yes/no + details
- [[ANCHOR:OPEN_QUESTIONS]]
- [[ANCHOR:LINK_CHECK]] pass/fail + broken paths

[SA:STOP]
If impact is ambiguous, stop after reporting options; do not guess.
