# AGM Prompt Pack

## Public starter pack (golden path)

Shipped in `agm/data/workflows-starter-prompts.json` with `@agm/cli`. Covers MCP golden path without any install step:

`bootstrap-adopt` · `bootstrap-continue` · `refinement` · `maintenance-diff-range` · `review-maintenance` · `review-phase` · `architecture-work-query` · `architecture-work-design`

Regenerate when `docs/assistant/workflows.json` changes:

```bash
node scripts/agm-split-prompts.mjs
```

## Full private pack (extended catalog)

Optional — all 25+ workflow prompt bodies in `workflows-prompts.json`. **Do not publish** to public npm.

### Generate locally (maintainers)

From the pattern repository root:

```bash
node scripts/agm-split-prompts.mjs
```

### Install location options

The CLI/MCP resolves prompts in this order:

1. Merge **starter** (`agm/data/workflows-starter-prompts.json`) with **private** if found
2. `promptsPath` in `.agm/config.json` (per project)
3. Environment variable `AGM_PROMPTS_PATH` (directory containing `workflows-prompts.json`)
4. `~/.agm/prompts-pack/workflows-prompts.json` (user-global)
5. `agm/prompts-pack/workflows-prompts.json` (development, gitignored)

Private entries override starter for the same workflow ID.

### Distribute full pack to licensed users

Copy only `workflows-prompts.json` via private channel (internal git, private npm, encrypted archive). Never commit the full pack to a public repository.
