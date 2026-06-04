# Documentation focus extensions

Selected in the [Assistant UI](https://abx-git.github.io/blueprint-pattern.github.io/) (Build form) or passed as `DOC_FOCUS` to `bp-install.sh` / the adoption parameter block. Bootstrap uses them to **extend `blueprint.md`** with extra phase rows and scaffold optional folders.

| ID | Label | Install (`bp-install.sh`) | Bootstrap (agent) |
|----|-------|---------------------------|-------------------|
| `onboarding` | Onboarding & navigation | — | `entry-point.md`: ## Onboarding (reading order by role); link from `always-on.md` |
| `operations` | Operations & incidents | `ops/` templates | Blueprint phase → `ops/`; link ## Operations in entry-point |
| `persistence` | Persistence & data | — | Prioritize data model in template sections (runtime, concepts, overview); `context/on-demand.md` data stores |
| `interfaces` | Integration contracts | (core `interfaces/`) | Early blueprint priority for `interfaces/exports.md` + `imports.md`; cross-link in building blocks / runtime |
| `security` | Security & compliance | — | Prioritize constraints, quality, risks; security notes in `context/on-demand.md` |
| `deployment` | Deployment & environments | `ops/environments.md` if `operations` off | Template deployment section + environment map in on-demand or ops |
| `observability` | Observability | `ops/troubleshooting.md` if `operations` off | Runtime/logging sections + `ops/troubleshooting.md` stub; link metrics/traces in entry-point |
| `decisions` | Architecture decisions (ADRs) | (template `decisions/`) | Early `[~]` or `[ ]` phase for `<template>/decisions/`; entry-point ADR index |
| `ecosystem` | Multi-service ecosystem | — | Emphasize `interfaces/imports.md` partner links; optional `ecosystem-index.md` stub at doc root if multi-repo |
| `domain-glossary` | Domain language & glossary | — | Prioritize glossary / context terms; `on-demand.md` concept table |

Comma-separated IDs: `onboarding,operations,persistence`
