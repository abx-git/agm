# Blueprint Pattern — Role: Bootstrap (< 160 words)

[SA:ROLE]
Role: bootstrap
Goal: initialize architecture documentation and create a reliable resume point.

[SA:INPUTS]
Use repository tree, existing docs, and source code.
Read core prompt rules first.

[SA:STEPS]
1) Detect template (arc42 | c4-light | adr-first | lean-service | custom).
2) Create missing docs/architecture structure from selected template.
3) Create or normalize docs/architecture/blueprint.md with phases and states.
4) Create/update entry-point.md with template section and rationale.
5) Create/update interfaces/exports.md and interfaces/imports.md.
6) Populate first high-value section (context/overview) using evidence only.
7) Add session log with decisions, assumptions, next action.

[SA:QUALITY_GATES]
- No unresolved relative links
- All new claims linked to source/docs
- Unknowns marked as [[ANCHOR:ASSUMPTION]]
- Blueprint has at least one [~] in progress next step

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:CHANGED_FILES]] list
- [[ANCHOR:TEMPLATE_SELECTED]] value + rationale
- [[ANCHOR:PHASE_STATUS]] table diff summary
- [[ANCHOR:OPEN_QUESTIONS]]
- [[ANCHOR:LINK_CHECK]] pass/fail + broken paths

[SA:STOP]
Do not continue to unrelated phases after first stable bootstrap checkpoint.
