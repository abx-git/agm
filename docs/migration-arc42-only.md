# Migration: arc42-only wording → optional templates

No breaking change for existing adopters.

## If you already use arc42

- Keep `arc42/` layout and Blueprint phases 1–12 unchanged.
- Add to `entry-point.md`:

  ```markdown
  ## Documentation template

  Selected template: arc42
  Rationale: <why arc42 fits this system>
  ```

- Replace role prompts under `docs/architecture/prompts/` with files from [docs/templates/architecture/prompts/role-bootstrap.md](./templates/architecture/prompts/role-bootstrap.md) (and other `role-*.md`).
- Adopt the compact [core prompt](../PROMPT.md#1-system-prompt) and semantic anchors (`[[ANCHOR:LINK_CHECK]]`, etc.).

## If you want a lighter template

| From | To | Action |
|------|-----|--------|
| arc42 (partial) | `c4-light` | Copy [c4-light/context.md](./templates/architecture/c4-light/context.md) and siblings; remap C4 content |
| arc42 decisions only | `adr-first` | Copy [adr-first/decisions/README.md](./templates/architecture/adr-first/decisions/README.md) and siblings |
| Single microservice | `lean-service` | Copy [lean-service/overview.md](./templates/architecture/lean-service/overview.md) and siblings |

Update `blueprint.md` phase table to match the new template paths. Do not delete historical arc42 files until content is migrated and reviewed.

## Prompt and tool rules

1. Update `PROMPT.md` system prompt (or tool rules) to the new core prompt.
2. Point Cursor/Copilot/Claude at [`.cursor/rules/`](../.cursor/rules/) or [`.github/copilot-instructions.md`](../.github/copilot-instructions.md).
3. Ensure `context/always-on.md` exists.

## Human review

Template changes are architectural decisions — record rationale in `entry-point.md` and run a **review** session before removing old sections.
