# AGM Assistant

Lifecycle UI: **Build** · **Evolve** · **Verify**, plus collapsed **Advanced** (Architect + Domain).

Day-1 = golden path only (6 workflows). Advanced intents stay available but are not required to start.

Live: https://abx-git.github.io/agm.github.io/

**Pages repo:** [abx-git/agm.github.io](https://github.com/abx-git/agm.github.io)  
**Setup (once):** [GITHUB-PAGES-SETUP.md](./GITHUB-PAGES-SETUP.md)

## Run locally

```bash
./scripts/open-assistant.sh
```

Opens `http://localhost:8765` (requires Python 3).

## Tabs

| Tab | What | Workflows |
|-----|------|-----------|
| **Build** | Install + adopt + continue | `agm-install.sh` (default golden; optional `--full`), `bootstrap-adopt`, `bootstrap-continue` |
| **Evolve** | Sync or deepen | `maintenance-diff-range`, `refinement` (+ paste-diff under More) |
| **Verify** | Report-only, fresh chat | `review-maintenance`, `review-phase` (+ milestone under More) |
| **Advanced** | After a graph exists | `architecture-work-*`, Domain pack under collapsed details |

## Publish

```bash
./scripts/sync-assistant-data.sh   # after editing prompts/workflows/
./scripts/push-assistant-to-pages.sh
```

Or CI: `.github/workflows/pages.yml` on push to `main`.
