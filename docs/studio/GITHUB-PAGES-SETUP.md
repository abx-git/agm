# GitHub Pages — setup (AGM Review Studio)

The Review Studio is **not** served from the agm repo root. It is built from `docs/studio/` and deployed to:

| Item | Value |
|------|--------|
| **Pages repository** | [abx-git/agm.github.io](https://github.com/abx-git/agm.github.io) |
| **Live URL** | **https://abx-git.github.io/agm.github.io/** |
| **Source in this repo** | `docs/studio/` → `npm run build` → `dist/` |

Deploy uses an **SSH deploy key** (not a PAT). Org PATs often authenticate as `abx-git` and get **403** on `git push`.

## 1. Enable Pages on the Pages repository

**https://github.com/abx-git/agm.github.io/settings/pages**

| Field | Value |
|-------|--------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | `/` (root) |

## 2. Deploy key

Same as before: RSA deploy key on **agm.github.io** (write), private key as `ACTIONS_DEPLOY_KEY` on **agm**. See the historical notes in [docs/assistant/GITHUB-PAGES-SETUP.md](../assistant/GITHUB-PAGES-SETUP.md) for key generation steps.

## 3. CI

`.github/workflows/pages.yml` on push to `main` when `docs/studio/**`, `docs/assistant/**`, or workflow prompts change:

1. `python3 scripts/sync-assistant-data.py`
2. `cd docs/studio && npm ci && npm run build`
3. rsync `docs/studio/dist/` to agm.github.io `main`

## 4. Manual publish

```bash
./scripts/push-studio-to-pages.sh
```

## Local

```bash
./scripts/open-studio.sh
```
