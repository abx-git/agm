# Workflows

Procedure: **[docs/guide.md](../docs/guide.md)** · **[docs/typical-dialog.md](../docs/typical-dialog.md)**

| Path | Purpose |
|------|---------|
| [adopt-standalone.md](./adopt-standalone.md) | **First chat** — paste to adopt pattern (scaffold + bootstrap) |
| [core/system-prompt.md](./core/system-prompt.md) | IDE rules (once) |
| [workflows/](./workflows/) | Session text per operation — copy into a new chat |
| [reference/](./reference/) | Blueprint format, base context, CI, adopt procedure |

Copy session prompts from the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) or from `workflows/<id>.md`. No checkout script in application repos.

*(This pattern repository optionally uses `./scripts/bp-workflow.sh checkout <id>` to write `ACTIVE.md` for Cursor rules.)*
