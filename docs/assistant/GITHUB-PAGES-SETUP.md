# GitHub Pages — setup

The interactive assistant is **not** served from this repository. It is deployed to:

| Item | Value |
|------|--------|
| **Pages repository** | [abx-git/agm.github.io](https://github.com/abx-git/agm.github.io) |
| **Live URL** | **https://abx-git.github.io/agm.github.io/** |
| **Source in this repo** | `docs/assistant/` (built by CI) |

Deploy uses an **SSH deploy key** (not a PAT). Org PATs often authenticate as `abx-git` and get **403** on `git push`.

## 1. Enable Pages on the Pages repository

**https://github.com/abx-git/agm.github.io/settings/pages**

| Field | Value |
|-------|--------|
| **Source** | Deploy from a branch |
| **Branch** | `main` |
| **Folder** | `/` (root) |

Save, wait 1–2 minutes.

> Optional: if secret `AGM_GHIO_DEPLOY` (user PAT with Administration) is set on **agm**, the workflow can enable Pages via API. Deploy itself does **not** need that PAT.

## 2. Deploy key (required)

### Generate a key pair (once)

```bash
ssh-keygen -t ed25519 -C "agm-ci-deploy" -f agm-pages-deploy -N ""
```

Creates `agm-pages-deploy` (private) and `agm-pages-deploy.pub` (public). Do **not** commit either file.

### Public key → **agm.github.io**

1. Open **https://github.com/abx-git/agm.github.io/settings/keys**
2. **Add deploy key**
   - Title: `agm CI deploy`
   - Key: contents of `agm-pages-deploy.pub`
   - Enable **Allow write access**
3. Add key

### Private key → **agm** secret

1. Open **abx-git/agm** → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret**
   - Name: `ACTIONS_DEPLOY_KEY`
   - Value: full contents of `agm-pages-deploy` (including `-----BEGIN … KEY-----` / `END` lines)
3. Delete the local key files when done: `rm -f agm-pages-deploy agm-pages-deploy.pub`

## 3. Run the deploy workflow

In **abx-git/agm**:

**Actions** → **Deploy Blueprint Assistant (GitHub Pages)** → **Run workflow** (branch `main`).

When green, open **https://abx-git.github.io/agm.github.io/** (after 1–2 minutes).

## 4. Ongoing updates

Every push to `main` that changes `docs/assistant/` or `prompts/workflows/` triggers a new deploy.

## Optional: PAT for Pages API only

Not required for push. Only if you want the workflow to auto-enable Pages:

| Secret on **agm** | Purpose |
|-------------------|---------|
| `AGM_GHIO_DEPLOY` | User classic PAT (`repo`) or fine-grained with Administration on `agm.github.io` |

Do **not** use an org-owned token that shows as `abx-git` for git push — that caused:

`Permission to abx-git/agm.github.io.git denied to abx-git` → 403.

Legacy fallback name: `BLUEPRINT_PATTERN_GHIO_DEPLOY` (still accepted for the optional Pages API step).

## Local link to the Pages repository

This clone should have **two** remotes:

| Remote | Repository |
|--------|------------|
| `origin` | `abx-git/agm` (source, CI, docs) |
| `pages` | `abx-git/agm.github.io` (GitHub Pages site) |

One-time setup from **agm** root:

```bash
git remote add pages https://github.com/abx-git/agm.github.io.git
git remote -v
```

If `pages` already exists, repoint it:

```bash
git remote set-url pages https://github.com/abx-git/agm.github.io.git
git remote -v
```

### Manual deploy from your machine

Requires write access to **agm.github.io** (SSH key or HTTPS credentials):

```bash
./scripts/push-assistant-to-pages.sh
```

This syncs `workflows.json`, splits `docs/assistant/` with `git subtree`, and pushes to `pages` → `main`. CI deploy (section 3) is the usual path; use the script for ad-hoc fixes without Actions.

## Local preview (no token needed)

From **agm** repository root:

```bash
./scripts/open-assistant.sh
```

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Missing `ACTIONS_DEPLOY_KEY` | Step 2 — add private key secret on **agm** |
| 403 / denied to `abx-git` | Stop using org PAT for push; use deploy key (step 2) |
| Deploy key exists but push fails | Public key must have **Allow write access** on **agm.github.io** |
| 404 on live URL | Enable Pages manually (step 1); wait 1–2 minutes after green deploy |
| Wrong repo Settings | Deploy key + Pages config are on **agm.github.io**; secret is on **agm** |
| Old PAT secrets only | Add `ACTIONS_DEPLOY_KEY`; PAT alone is no longer enough for CI push |
| Old repo `agm.github.io` | Deprecated; use **[abx-git/agm.github.io](https://github.com/abx-git/agm.github.io)** |
