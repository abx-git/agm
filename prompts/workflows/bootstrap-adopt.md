# Workflow: bootstrap-adopt

| Field | Value |
|-------|-------|
| **When** | First-time adoption; no `docs/architecture/blueprint.md` yet |
| **Role** | `bootstrap` |
| **Fresh session** | Required |

## Session prompt

```
AGM — Adopt (standalone session).
Workflow: bootstrap-adopt
Role: bootstrap

Adopt the Architecture Graph Method (AGM) into this application repository. The human has already run `bp-install.sh` (Assistant UI → Build → Install). Execute Phase B–C in prompts/reference/adopt-procedure.md only.

Prerequisites: application repository open in the IDE; install script completed; human available for a short interview.

Instructions:
1. If <doc-root>/blueprint.md already exists, stop and tell the human to paste the bootstrap-continue session prompt in a new chat instead.
2. Verify Phase A in prompts/reference/adopt-procedure.md: role-bootstrap.md and prompts/core/system-prompt.md must exist. If missing, stop — ask the human to run the install script (no git clone).
3. If an **Adoption parameters** block is present (with **File roles**), create always-on.md, blueprint.md, and entry-point.md as separate files under <doc-root>; interview only for missing facts.
4. If **Architecture documentation areas (bootstrap)** is present, add blueprint phases and doc stubs for each selected area per prompts/reference/doc-extensions.md (your Markdown only).
5. Bootstrap: follow <doc-root>/prompts/role-bootstrap.md — construction plan in blueprint.md, navigation in entry-point.md, first evidence-based template section.
6. Verify relative links. Append a session log entry to blueprint.md.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:TEMPLATE_SELECTED]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
