---
type: architecture-role-prompt
title: "Role: Bootstrap"
description: "AGM bootstrap role — initialize architecture documentation"
resource: "repo://"
tags: [role, bootstrap, agm]
timestamp: ""
---

# AGM — Role: Bootstrap (< 160 words)

[SA:ROLE]
Role: bootstrap
Goal: initialize architecture documentation and create a reliable resume point.

[SA:INPUTS]
Use repository tree, existing docs, and source code.
Read core prompt rules first.

[SA:STEPS]
1) Detect template (arc42 | c4-light | adr-first | lean-service | custom).
2) Create missing docs/architecture structure from selected template. Instantiate each file from its template with OKF YAML frontmatter and the template's `type` (e.g. `architecture-context`, `adr`, `architecture-component-view`, `architecture-interface`). Create root `index.md` and `log.md` from templates.
3) Create blueprint.md — construction plan with phase rows → target files and states (`type: architecture-blueprint`).
4) Create entry-point.md — graph index: navigation table to all sections and source links (agent traversal); optional short overview (no phase status) (`type: architecture-entry-point`).
5) Create/update interfaces/exports.md and interfaces/imports.md (`type: architecture-interface`).
6) Populate first high-value section (context/overview) using evidence only; preserve OKF `type` from the template and set `timestamp` to session date.
7) Append session summary to `log.md` and add session log entry in blueprint.md with decisions, assumptions, next action.

[SA:QUALITY_GATES]
- No unresolved relative links
- All new claims linked to source/docs
- Unknowns marked as [[ANCHOR:ASSUMPTION]]
- Blueprint has at least one [~] in progress next step
- Every created/updated file has valid OKF frontmatter with non-empty `type`
- Root `index.md` and `log.md` exist and link to created sections

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:CHANGED_FILES]] list
- [[ANCHOR:TEMPLATE_SELECTED]] value + rationale
- [[ANCHOR:PHASE_STATUS]] table diff summary
- [[ANCHOR:OPEN_QUESTIONS]]
- [[ANCHOR:LINK_CHECK]] pass/fail + broken paths

[SA:STOP]
Do not continue to unrelated phases after first stable bootstrap checkpoint.
