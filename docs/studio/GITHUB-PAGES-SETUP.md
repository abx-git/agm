# GitHub Pages — full Tekto site

**Tekto Studio** (SPA at `/`) plus static **documentation** (`/docs/`) ship in one build from this repo.

| Item | Value |
|------|--------|
| **Pages repository** | [abx-git/agm.github.io](https://github.com/abx-git/agm.github.io) (→ `tekto.github.io` when renamed) |
| **Live URL** | **https://abx-git.github.io/agm.github.io/** |
| **Source in this repo** | `npm run build:pages` in `docs/studio/` → Studio + rendered Markdown in `dist/` |
| **CI** | [.github/workflows/pages.yml](../../.github/workflows/pages.yml) — *Deploy Tekto Studio* |
| **Jekyll off** | `docs/studio/public/.nojekyll` + CI `touch .nojekyll` at site root |

Vite uses `base: './'` so the SPA works on GitHub Pages without a fixed subpath.

## Site map (after deploy)

| Path | Content |
|------|---------|
| `/` | Tekto Studio (bind your repo folder) |
| `/docs/` | Hub — quickstart, positioning, guide, MCP, validator, … |
| `/docs/tekto-bundle/` | Raw copy of monorepo `docs/tekto/` (demo / reference) |

Build: `scripts/build-tekto-pages.mjs` (Vite + Marked).

## What runs in CI

On push to `main` when Studio or product docs change:

1. `cd docs/studio && npm ci && npm run build:pages`
2. rsync `dist/` to `agm.github.io` branch `main`
3. Wait for **pages-build-deployment**, then HTTP smoke check

## 1. Enable Pages on the Pages repository

**https://github.com/abx-git/agm.github.io/settings/pages**

| Field | Value |
|-------|--------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | `/` (root) |

Use **Deploy from a branch**, not “GitHub Actions” only — this workflow pushes files via SSH.

## 2. Secrets on the source repo (tekto / agm)

| Secret | Purpose |
|--------|---------|
| `ACTIONS_DEPLOY_KEY` | Private half of a deploy key with **write** on `agm.github.io` |
| `TEKTO_GHIO_DEPLOY` or `AGM_GHIO_DEPLOY` (optional) | PAT to enable Pages via API |

Deploy key: generate RSA key pair, add **public** key under agm.github.io → Settings → Deploy keys (allow write). Paste **private** key into `ACTIONS_DEPLOY_KEY` on the source repo.

## 3. Manual publish

```bash
git remote add pages https://github.com/abx-git/agm.github.io.git   # once
./scripts/push-studio-to-pages.sh
```

Then confirm [pages-build-deployment](https://github.com/abx-git/agm.github.io/actions/workflows/pages-build-deployment.yml) is green.

## 4. Two-step publish

1. Source repo Actions pushes files to `agm.github.io` `main`
2. GitHub runs **pages build and deployment** on `agm.github.io` — only then does the live URL update

## Troubleshooting

| Symptom | Check |
|---------|--------|
| Workflow fails immediately | `ACTIONS_DEPLOY_KEY` missing or deploy key not write-enabled |
| Green push, old site | Re-run **pages-build-deployment** on agm.github.io |
| 404 on live URL | Pages source = branch `main` / folder `/` |
| Wrong repo in `git remote pages` | Must point at `agm.github.io`, not blueprint-pattern |

### Verify freshness

```bash
curl -sS https://raw.githubusercontent.com/abx-git/agm.github.io/main/index.html | grep -o 'index-[^"]*\.js'
curl -sS https://abx-git.github.io/agm.github.io/ | grep -o 'index-[^"]*\.js'
```

Hashes should match after CDN propagation.

## Local

```bash
./scripts/open-studio.sh
```