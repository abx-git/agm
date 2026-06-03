# Base context setup

**Behavior** lives in [system-prompt.md](../core/system-prompt.md). **Knowledge** lives in `docs/architecture/context/`.

1. Copy [always-on.md](../../docs/templates/architecture/context/always-on.md) → `docs/architecture/context/always-on.md`
2. Copy [on-demand.md](../../docs/templates/architecture/context/on-demand.md) → `docs/architecture/context/on-demand.md`
3. Fill in app identity, source map, and session protocol during Bootstrap
4. Wire into your tool:

| Tool | Action |
|------|--------|
| **Cursor** | [`.cursor/rules/blueprint-context.mdc`](../../.cursor/rules/blueprint-context.mdc) + [blueprint-pattern.mdc](../../.cursor/rules/blueprint-pattern.mdc) + active workflow via [checkout](../README.md#git-checkout) |
| **Claude Code** | Append core prompt + link to `always-on.md` in `CLAUDE.md` |
| **Amazon Q** | Copy context rules to `.amazonq/rules/blueprint-context.md` |
| **GitHub Copilot** | [`.github/copilot-instructions.md`](../../.github/copilot-instructions.md) |

Copy role prompts from [docs/templates/architecture/prompts/](../../docs/templates/architecture/prompts/) → `docs/architecture/prompts/`.

Copy workflow session prompts from [prompts/workflows/](../workflows/) or activate one via git checkout (see [prompts/README.md](../README.md)).

See [Extensions guide](../../docs/blueprint-pattern-extensions.md) for rationale.
