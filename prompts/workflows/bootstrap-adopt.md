# Workflow: bootstrap-adopt

| Field | Value |
|-------|-------|
| **When** | First-time adoption; no `docs/architecture/blueprint.md` yet |
| **Role** | `bootstrap` |
| **Fresh session** | Required |

## Session prompt

```
Blueprint Pattern — Adopt (standalone session).
Workflow: bootstrap-adopt
Role: bootstrap

Adopt the Blueprint Pattern into this application repository. Execute this session like a setup script: write the documentation scaffold, configure application context, then run bootstrap.

Prerequisites: application repository open in the IDE; human available for a short interview.

Instructions:
1. If docs/architecture/blueprint.md already exists, stop and tell the human to paste the bootstrap-continue session prompt in a new chat instead.
2. Execute Phase A–C in prompts/reference/adopt-procedure.md: write all files directly — no git clone, zip, curl, or bp-workflow.sh.
3. If an **Adoption parameters** block is present (with **File roles**), create always-on.md, blueprint.md, and entry-point.md as separate files; interview only for missing facts.
4. Remind the human to install prompts/core/system-prompt.md in IDE rules (once).
5. Bootstrap: follow docs/architecture/prompts/role-bootstrap.md — construction plan in blueprint.md, navigation in entry-point.md, first evidence-based template section.
6. Verify relative links. Append a session log entry to blueprint.md.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:TEMPLATE_SELECTED]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
