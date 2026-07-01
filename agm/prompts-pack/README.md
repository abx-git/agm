# AGM Prompt Pack

## Public npm (`@agm/cli`)

Golden-path prompts ship as **`agm/data/workflows-prompts-compressed.json`** (LLMLingua-2).  
**No plaintext** in the published package.

Regenerate from the private monorepo:

```bash
node scripts/agm-split-prompts.mjs    # writes plaintext starter (private git)
node scripts/agm-compress-prompts.mjs   # writes compressed public artifact
```

## Full private pack (extended catalog)

All workflow bodies in `workflows-prompts.json` (plaintext, **gitignored**).  
Compress for distribution:

```bash
node scripts/agm-compress-prompts.mjs   # also writes prompts-pack/workflows-prompts-compressed.json
```

### Install locations (full tier)

1. Merge with public compressed starter when found
2. `promptsPath` in `.agm/config.json`
3. `AGM_PROMPTS_PATH` → directory with `workflows-prompts-compressed.json` or `workflows-prompts.json`
4. `~/.agm/prompts-pack/`
5. `agm/prompts-pack/` (development)

Private entries override starter for the same workflow ID.

### Distribute to licensed users

Ship **`workflows-prompts-compressed.json` only** (preferred) via private npm, git, or encrypted archive.  
Never commit plaintext full pack or starter to a public repository.

See [PUBLISHING.md](../PUBLISHING.md).
