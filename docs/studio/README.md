# Tekto Studio

Local cockpit for **Tekto** documentation: bind a repo folder, browse `docs/tekto/`, manage reviews, copy CLI commands.

| Mode | URL |
|------|-----|
| **Local** | `./scripts/open-studio.sh` → http://localhost:5173 |
| **GitHub Pages** | [Studio](https://abx-git.github.io/agm.github.io/) · [Docs](https://abx-git.github.io/agm.github.io/docs/) ([setup](./GITHUB-PAGES-SETUP.md)) |

Pages runs the same static build as `npm run build` in this folder; you still pick a local folder via the browser (File System Access API).

## In scope (Wave 2)

| Workspace | Purpose |
|-----------|---------|
| **Docs** | Browse and read architecture Markdown |
| **Review** | `findings.yaml` / `threads.yaml` / `report.md` |
| **Composer** | Copy `init` · `export` · `check` per AI tool |
| **Ask AI** | Context pack + skill prompts to paste into your IDE |

## Out of scope

- No embedded LLM or cloud agent
- No inbox / storm / spike / legacy AGM workflow catalog
- No substitute for Git or `tekto check` in CI

Copy prompts into Cursor, Claude Code, Copilot, or Kiro.