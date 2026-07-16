# Workflow: bootstrap-init

| Field | Value |
|-------|-------|
| **Track** | Build |
| **Activity** | Communicate |
| **Mode** | Direct |
| **When** | First-time setup; no `docs/architecture/blueprint.md` yet |
| **Role** | `bootstrap` |
| **Fresh session** | Recommended |

## Session prompt

```
AGM — Build · Init
Workflow: bootstrap-init
Role: bootstrap

Bootstrap AGM documentation for this application.

Follow docs/architecture/prompts/role-bootstrap.md (copy from docs/templates/architecture/prompts/ if missing).
Read prompts/core/system-prompt.md rules. Create docs/architecture/ structure from the chosen template.

Output [[ANCHOR:CHANGED_FILES]], [[ANCHOR:TEMPLATE_SELECTED]], [[ANCHOR:PHASE_STATUS]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
