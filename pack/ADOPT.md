# Blueprint Pattern — adoption

## Recommended: one adoption prompt

Open your application repository in an AI IDE. Start a **new chat** and paste the adoption prompt from:

- [prompts/adopt-standalone.md](https://github.com/abx-git/blueprint-pattern/blob/main/prompts/adopt-standalone.md)  
- or the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) → **Copy adoption prompt**

The agent downloads this kit, configures `always-on.md`, and runs bootstrap — like executing a setup script.

## Alternative: manual zip

Download [blueprint-pattern-adopt.zip](https://github.com/abx-git/blueprint-pattern/releases/latest/download/blueprint-pattern-adopt.zip), unzip at repo root, then `./scripts/bp-workflow.sh checkout bootstrap-init`.

## Part 1 — Create documentation

| Step | Action |
|------|--------|
| 1 | Run adoption prompt (scaffold + bootstrap) **or** unzip kit + `bootstrap-init` |
| 2+ | `./scripts/bp-workflow.sh checkout bootstrap-continue` — repeat until done |
| Close | `checkout review-milestone` (new chat, report-only) |

## Part 2 — Use documentation

| Intent | Workflow |
|--------|----------|
| After code change | `maintenance` |
| Architecture question | `architecture-work-query` |
| Analysis | `architecture-work-analysis` |
| Design proposal | `architecture-work-design` |
| Open work items | `architecture-work-continue` |
| Deepen a section | `refinement` |
| Review | `review-maintenance` |

Each session: `checkout <id>` → new chat → review `blueprint.md`.
