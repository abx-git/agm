# Architecture documentation areas

In the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) → **Build** → **What do you want to document?**, pick a **preset** (e.g. *ER diagram & database*) once. That choice applies to install, adoption, and Evolve — no duplicate forms.

Advanced IDs can be passed as `DOC_FOCUS` to `bp-install.sh`. They control **which Markdown architecture files** the agent should create, extend, or keep aligned with code in **your application repository** (under the documentation root).

They do **not** change:

- Blueprint Pattern prompts (`prompts/`)
- Workflows, roles, or adoption procedure
- How `blueprint.md` works as a construction plan (only *which doc areas* get extra phases or priority)

Think: **content areas in your architecture graph**, not **how you run Blueprint Pattern**.

| ID | Label (UI) | Your Markdown (examples) | Install | Bootstrap | Evolve |
|----|------------|--------------------------|---------|-----------|--------|
| `onboarding` | entry-point — onboarding | `entry-point.md`, `always-on.md` | — | ## Onboarding in entry-point | Keep reading paths current |
| `operations` | ops/ — operations | `ops/` tree | full `ops/` | blueprint ops/ phase; entry-point ## Operations | Update ops/ on runtime/deploy/incident diffs |
| `persistence` | data & persistence | template data sections, `context/on-demand.md` | — | data model priority; on-demand stores | Sync schema/migration-related docs |
| `interfaces` | interfaces/ — APIs | `interfaces/exports.md`, `imports.md` | core `interfaces/` | early interfaces/ phase | Update exports/imports on API changes |
| `security` | security in template | constraints, quality, risks, on-demand | — | elevated security phases | Update on auth/policy changes |
| `deployment` | deployment docs | template deployment + `ops/environments.md`* | partial `ops/`* | deployment + environments | Sync infra/config diffs |
| `observability` | observability docs | runtime + `ops/troubleshooting.md`* | partial `ops/`* | runtime + troubleshooting stub | Update logging/metrics/tracing docs |
| `decisions` | ADRs | `<template>/decisions/` | `decisions/` | ADR phase + entry-point index | Draft/update ADRs when decisions implied |
| `ecosystem` | ecosystem & partners | `ecosystem-index.md`, `interfaces/imports.md` | stub `ecosystem-index.md` | imports + ecosystem links | Update partner links |
| `domain-glossary` | glossary & terms | glossary / context, `on-demand.md` | — | glossary phase | Update terminology |

\*If `operations` is not selected, partial `ops/` files install only for deployment/observability.

Comma-separated IDs: `onboarding,operations,persistence`
