# External process drafts (spikes)

Keep Architecture / Domain **spike drafts** outside the application Git repository so each developer can prepare AGM solutions locally without committing drafts.

The logical path stays `${doc-root}/process/spikes/` (preferred). Legacy `${doc-root}/spikes/` or `${doc-root}/work/` remain readable. Physically, that path is a **symlink** to a per-machine directory outside the repo.

---

## Why

| Concern | With in-repo `process/spikes/` | With external link |
|---------|--------------------------------|--------------------|
| Draft analyses / designs / boards | Risk of accidental commit | Stay local until you promote |
| Multi-developer prep | Shared noise in PRs | Each machine has its own scratch space |
| Agent paths | `process/spikes/YYYY-MM-DD-…/` | Unchanged (via symlink) |
| CI link check | Sees committed spike files | Does not see local drafts — promote before merge |

Verify reviews live under `process/reviews/` (usually committed). Legacy flat `work/` / top-level `spikes/` still supported for older graphs.

---

## Layout

```
# Application repo (Git)
docs/architecture/
├── blueprint.md          ← Spike + Review registers (shared)
├── entry-point.md
├── process/
│   ├── reviews/          ← REV reports (usually in Git)
│   └── spikes → /Users/you/agm-work/my-app/spikes   ← symlink (gitignored)
└── work-location.md      ← tracked pointer for humans/agents

# Outside Git (local)
~/agm-work/my-app/spikes/
├── _template/
└── 2026-07-24-my-draft/
    ├── index.md
    ├── notes.md
    └── boards/
```

Agents write under `docs/architecture/process/spikes/YYYY-MM-DD-<slug>/`. The OS resolves the symlink.

> **Note:** `--work-dir` historically pointed at `work/`. Prefer linking `process/spikes/`.

---

## Setup

### New install

```bash
./agm-install.sh --project "My App" --work-dir "$HOME/agm-work/my-app/spikes"
# links <doc-root>/process/spikes → work-dir
```

### Existing graph

```bash
./agm-work-link.sh --doc-root docs/architecture/ --work-dir "$HOME/agm-work/my-app/spikes"
# --legacy-work → link work/ instead
# for old top-level spikes/: move or re-link manually if needed
```

See also `agm work-link` in the CLI when available.

### Gitignore

The helper adds `<doc-root>process/spikes/` (or the legacy link path) to `.gitignore`. Keep `work-location.md` tracked.

---

## Agent behaviour

- New spikes → `process/spikes/YYYY-MM-DD-<slug>/`
- New Verify reviews → `process/reviews/YYYY-MM-DD-<slug>/` (report.md + findings.md)
- Register `SPK-NNN` / `REV-NNN` in `blueprint.md` when the item should be visible to the team
- Promote durable findings into template sections; leave process folders as provenance

---

## Compatibility

| Path | Status |
|------|--------|
| `process/spikes/` | Preferred write target |
| `process/reviews/` | Preferred Verify write target |
| Top-level `spikes/` | Legacy read |
| `work/` + `WRK-*` | Legacy read |
