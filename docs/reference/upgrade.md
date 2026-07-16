# Upgrade installed AGM

Refresh **platform files** (workflows, prompts, agent roles, IDE rules) after a new AGM release — **without** overwriting your architecture documentation.

Use this when a new workflow appears (e.g. `content-ingest`), reference procedures change, or MCP compressed prompts were updated in `@abx-hh/agm-cli`.

---

## What gets updated

| Path | Action |
|------|--------|
| `prompts/core/system-prompt.md` | Overwrite |
| `prompts/reference/*.md` | Overwrite |
| `prompts/workflows/*.md` | Overwrite (for your installed pack) |
| `<doc-root>/prompts/role-*.md` | Overwrite (agent tooling — not architecture content) |
| `.cursor/rules/agm*.mdc`, `CLAUDE.md`, … | Overwrite |
| `.agm-install-meta` | Append `upgraded=` timestamp |

## What is never touched

| Path | Reason |
|------|--------|
| `blueprint.md`, `entry-point.md` | Orchestration graph |
| `context/always-on.md`, `on-demand.md` | Session identity |
| `<template>/` (arc42, lean-service, …) | Your documented architecture |
| `work/*` (except `_template*.md`) | Work reports (in-repo or external symlink target) |
| `interfaces/`, `ops/`, `domain/` | Content |
| `index.md`, `log.md` | OKF indexes and change logs |

When `work/` is a symlink ([external-work.md](./external-work.md)), upgrade writes missing templates into the **external** directory and leaves the symlink alone.

## Added only if missing (default)

| Path | When |
|------|------|
| `sources/` | New in AGM v41+ — paste imports |
| `use-cases/` | Distilled scenarios |
| `work/_template*.md` | Templates |
| `domain/` | With `--domain` / `--full` upgrade |

Link new folders from `entry-point.md` in a **Continue** session if you want them in the agent navigation graph.

---

## Option A — Assistant UI (curl script)

**Build** tab → **Upgrade installed AGM** → copy script → run at **application repo root**.

Or directly:

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-upgrade.sh | bash
```

Add Domain or Architect packs on an existing golden install:

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-upgrade.sh | bash -s -- --domain
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-upgrade.sh | bash -s -- --full
```

Reads `doc_root`, `pack`, and `ai_tool` from `.agm-install-meta` when present.

---

## Option B — npm CLI / MCP

```bash
npx @abx-hh/agm-cli upgrade
npx @abx-hh/agm-cli upgrade --full
```

MCP: ask your agent to call **`agm_upgrade`** (same options as CLI).

Also update the npm package so MCP compressed prompts match:

```bash
npm update @abx-hh/agm-cli
# or
npx @abx-hh/agm-cli@latest upgrade
```

---

## Do not use for upgrades

| Command | Risk |
|---------|------|
| Re-run **`agm-install.sh`** | Overwrites template stubs, `always-on.md`, `interfaces/` stubs, … |
| **`agm scaffold --force`** | Same — full scaffold replace |
| **`agm init --force`** | Overwrites the three core graph files |

---

## After upgrade

1. Confirm new workflow exists: `prompts/workflows/content-ingest.md`
2. Use **Evolve → Import pasted content** in the Assistant UI
3. Optional: **Continue** session to add `sources/` links to `entry-point.md`
4. **Verify** in a fresh chat if you changed role behaviour materially

---

## See also

- [install.md](./install.md) — first-time setup
- [content-ingest.md](./content-ingest.md) — paste import procedure
- [guide.md](../guide.md) — golden path
