# Architecture documentation areas

General categories of **your** architecture Markdown (multi-select in the Assistant). IDs are passed as `DOC_FOCUS` to `bp-install.sh` and injected into adoption and Evolve prompts.

They do **not** change Blueprint Pattern prompts, workflows, or procedure.

## Lifecycle (how the UI maps to this)

| Stage | Tab / step | What happens |
|-------|------------|--------------|
| **Foundation** | Build → 1 Install | Scaffold: `prompts/`, template folder, core layout — no area selection required |
| **Plan** | Build → 2 Areas | Multi-select categories → install extras, adopt phases, blueprint rows |
| **Adopt** | Build → 3 | Agent creates `blueprint.md`, `entry-point.md`, `always-on.md` using step 2 |
| **Continue** | Build → 4–5 | Follow open rows in `blueprint.md` |
| **Improve & sync** | Evolve | Same area checkboxes (add more anytime) + deepen / maintenance workflows |

## Categories

| ID | Label (UI) | Your Markdown (examples) |
|----|------------|--------------------------|
| `onboarding` | Graph index (entry-point) | `entry-point.md` link table for agent traversal; `always-on.md` points here |
| `implementation` | Software structure & implementation | Template building blocks / runtime / components; `always-on.md` source map; `work/` |
| `interfaces` | APIs & integration | `interfaces/exports.md`, `imports.md` |
| `persistence` | Data & storage | Template data sections, `context/on-demand.md` (any storage, not only RDBMS) |
| `security` | Security & compliance | Constraints, quality, risks, on-demand notes |
| `deployment` | Deployment & environments | Template deployment section, `ops/environments.md` |
| `observability` | Observability | Runtime notes, `ops/troubleshooting.md` |
| `operations` | Operations & incidents | `ops/` (runbooks, pitfalls, troubleshooting) |
| `decisions` | Architecture decisions | `<template>/decisions/` ADRs |
| `domain-glossary` | Domain language & glossary | Glossary / context terminology |
| `ecosystem` | Multi-service landscape | `ecosystem-index.md`, partner links |

Install/bootstrap/evolve behaviour per ID is unchanged; see git history or workflow prompts for detail.

Comma-separated: `onboarding,interfaces,operations`
