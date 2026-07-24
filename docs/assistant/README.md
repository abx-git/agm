# AGM Assistant (legacy source)

The interactive **workflow prompt generator** now ships inside **[AGM Review Studio](../studio/README.md)** (Workflows tab).

| Item | Value |
|------|--------|
| **Product entry** | [docs/studio](../studio/README.md) — `./scripts/open-studio.sh` |
| **Live** | https://abx-git.github.io/agm.github.io/ |
| **This folder** | Source for `index.html` / `app.js` / `app.css` / `workflows.json` — synced into `docs/studio/public/assistant/` |

## Still useful here

Edit the Assistant UI or run sync:

```bash
./scripts/sync-assistant-data.sh   # after editing prompts/workflows/
./scripts/open-assistant.sh       # Assistant-only on :8765 (no Browse mode)
```

Prefer Studio for day-to-day use. Pages deploy publishes Studio, not this folder alone.
