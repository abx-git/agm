# AGM Prompt Pack (private)

**Do not publish** this folder with the public `@agm/cli` package.

Contains workflow prompt bodies (`workflows-prompts.json`). The public tool ships only `data/workflows-catalog.json` (metadata + procedure steps, no `prompt` field).

## Generate locally (maintainers)

From the pattern repository root:

```bash
node scripts/agm-split-prompts.mjs
```

## Install location options

The CLI/MCP resolves prompts in this order:

1. `promptsPath` in `.agm/config.json` (per project)
2. Environment variable `AGM_PROMPTS_PATH` (directory containing `workflows-prompts.json`)
3. `~/.agm/prompts-pack/workflows-prompts.json` (user-global)
4. `agm/prompts-pack/workflows-prompts.json` (development, this folder)

## Distribute to licensed users

Copy only `workflows-prompts.json` via private channel (internal git, private npm, encrypted archive). Never commit to a public repository.
