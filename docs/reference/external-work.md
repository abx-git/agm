# External spikes directory

Keep Architecture / Domain **spike drafts** outside the application Git repository so each developer can prepare AGM solutions locally without committing drafts.

The logical path stays `${doc-root}/spikes/` (preferred) or legacy `${doc-root}/work/` (relative links, agents, Spike/WRK register). Physically, that path is a **symlink** to a per-machine directory outside the repo.

---

## Why

| Concern | With in-repo `spikes/` | With external `spikes/` |
|---------|------------------------|-------------------------|
| Draft analyses / designs / boards | Risk of accidental commit | Stay local until you promote |
| Multi-developer prep | Shared noise in PRs | Each machine has its own scratch space |
| Agent paths | `spikes/YYYY-MM-DD-…/` | Unchanged (via symlink) |
| CI link check | Sees committed spike files | Does not see local drafts — promote before merge |

Legacy flat `work/` is still supported for older graphs.

---

## Layout

```
# Application repo (Git)
docs/architecture/
├── blueprint.md          ← Spike register (shared)
├── entry-point.md
├── spikes → /Users/you/agm-work/my-app/spikes   ← symlink (gitignored)
└── work-location.md      ← tracked pointer for humans/agents

# Outside Git (local)
~/agm-work/my-app/spikes/
├── _template/
└── 2026-07-24-my-draft/
    ├── index.md
    ├── notes.md
    └── boards/
```

Agents write under `docs/architecture/spikes/YYYY-MM-DD-<slug>/`. The OS resolves the symlink.

> **Note:** `--work-dir` install flag historically pointed at `work/`. Prefer linking `spikes/` the same way (or keep both during migration).


---

## Setup

### New install

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-install.sh | bash -s -- \
  --project "my-app" --template arc42 --ai-tool cursor \
  --work-dir "$HOME/agm-work/my-app/work"
```

Or MCP / npm:

```bash
npx @abx-hh/agm-cli scaffold --project "my-app" --template arc42 \
  --work-dir "$HOME/agm-work/my-app/work"
```

### Existing installation

```bash
curl -fsSL https://raw.githubusercontent.com/abx-git/agm/main/scripts/agm-work-link.sh | bash -s -- \
  --work-dir "$HOME/agm-work/my-app/work"
# optional: --doc-root docs/architecture/
```

The script:

1. Creates the external directory (if missing)
2. Moves any existing `${doc-root}/work/` contents into it
3. Replaces `${doc-root}/work` with a symlink
4. Appends `${doc-root}work` to `.gitignore`
5. Writes `${doc-root}work-location.md` (tracked) and records the path in `.agm-install-meta` / `.agm/config.json`

---

## Session rules

1. Write work items under `${doc-root}work/` as usual.
2. Register `WRK-NNN` in `blueprint.md` only when the item should be visible to the team — or keep draft register rows local until promote.
3. **Promote** shared findings into template sections (`arc42/`, `interfaces/`, …) via Continue / Refinement; do not rely on uncommitted work files for CI.
4. Before a PR that links to a work file from `blueprint.md`, either:
   - copy that file into a real in-repo `work/` for the PR, or
   - fold the conclusion into a versioned architecture section and drop the file link.

---

## Upgrade

`agm-upgrade.sh` / `agm upgrade` never overwrite work content. With external work:

- Missing `_template*.md` are added **into the symlink target** (the external directory).
- The symlink itself is left alone.

---

## Windows

Prefer Git Bash or WSL for `agm-work-link.sh` (symlink via `ln -s`). In PowerShell as Administrator:

```powershell
New-Item -ItemType SymbolicLink -Path "docs\architecture\work" -Target "$env:USERPROFILE\agm-work\my-app\work"
```

Ensure `docs/architecture/work` is listed in `.gitignore`.

---

## See also

- [install.md](./install.md)
- [upgrade.md](./upgrade.md)
- [guide.md](../guide.md) — file model
