# Architecture Graph Method (AGM) — Prompt entry

All prompts and the procedure:

- **[docs/guide.md](./docs/guide.md)** — procedure
- **[docs/typical-dialog.md](./docs/typical-dialog.md)** — example sessions

Workflow files: [prompts/workflows/](./prompts/workflows/) · Core: [prompts/core/system-prompt.md](./prompts/core/system-prompt.md)

## OKF compliance (Google Open Knowledge Format v0.1)

Architecture artifacts follow OKF metadata conventions:

- Every file under `docs/architecture/` (and template scaffolds in `docs/templates/architecture/`) uses YAML frontmatter with a required `type` field.
- Recommended fields: `title`, `description`, `resource`, `tags`, `timestamp`.
- `index.md` and `log.md` at each structure level support progressive disclosure and change tracking.
- Relative Markdown links remain the knowledge graph.

Core invariants: [prompts/core/system-prompt.md](./prompts/core/system-prompt.md) · Cursor rules: [.cursor/rules/blueprint-pattern.mdc](./.cursor/rules/blueprint-pattern.mdc)
