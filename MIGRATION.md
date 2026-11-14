# Migration from AGM to Tekto

Tekto 1.0 replaces AGM (Architecture Graph Method). There is no in-product legacy path.

## One-shot script

From your application repo root:

```bash
node /path/to/tekto/scripts/migrate-from-agm.mjs
```

The script:

1. Renames `docs/architecture/` → `docs/tekto/` when present
2. Merges `entry-point.md` + `blueprint.md` links into `steer.md` (manual review required)
3. Writes `.tekto/config.json` and removes `.agm/` metadata when safe

Then run:

```bash
npx -y @abx-hh/tekto export --ai-tool cursor
tekto check
```

## Manual

| AGM | Tekto |
|-----|-------|
| `entry-point.md` + `blueprint.md` | `steer.md` |
| `docs/architecture/` | `docs/tekto/` |
| `prompts/workflows/*` | `packs/skills/*` + `tekto packet` |
| `agm` / `agm-mcp` | `tekto` / `tekto-mcp` |