# Architecture templates

Installed into your application by [bp-install.sh](../../../scripts/bp-install.sh) (or the Assistant UI generator) as `<doc-root>/` before the adoption session.

## Core files (all templates)

| Path | Purpose |
|------|---------|
| [context/always-on.md](./context/always-on.md) | Session orientation |
| [context/on-demand.md](./context/on-demand.md) | Domain / environment (on demand) |
| [prompts/role-*.md](./prompts/) | Operational role prompts |
| `blueprint.md` | Construction plan + state (see [blueprint-format](../../../prompts/reference/blueprint-format.md)) |
| `entry-point.md` | Agent graph index: navigation table to all docs and sources (+ optional overview, ## Documentation template) |
| `interfaces/exports.md` · `imports.md` | Contracts |
| [work/_template.md](./work/_template.md) · [_template-review.md](./work/_template-review.md) | Architecture Work + Review |

## Documentation templates (pick one)

| Template | Folder | Blueprint phases |
|----------|--------|------------------|
| `arc42` (default) | Use existing [sample introduction](../../../examples/sample-app/order-service/docs/architecture/arc42/introduction.md) | 1–12 + ops optional |
| `c4-light` | [c4-light/](./c4-light/) | Context → containers → components → decisions |
| `adr-first` | [adr-first/](./adr-first/) | Decisions → context → views |
| `lean-service` | [lean-service/](./lean-service/) | Overview → runtime → decisions |
| `custom` | Your layout | Define rows in `blueprint.md` |

## Optional (Assistant UI → Architecture documentation areas)

| Focus ID | Path / effect |
|----------|----------------|
| `implementation` | Structure, runtime, source map in `always-on.md`, `work/` |

`entry-point.md`, `blueprint.md`, and `always-on.md` are **always** agent-maintained — not selectable in the Assistant.
| `operations` | [ops/](./ops/) runbooks, pitfalls, troubleshooting |
| `persistence` | Data model sections + `context/on-demand.md` |
| `interfaces` | `interfaces/` (core; elevated in blueprint) |
| `security` | constraints / quality / risks |
| `deployment` | deployment + `ops/environments.md` |
| `observability` | runtime + `ops/troubleshooting.md` |
| `decisions` | `<template>/decisions/` |
| `ecosystem` | `ecosystem-index.md`, imports |
| `domain-glossary` | glossary + domain terms |

See [doc-extensions](../../../prompts/reference/doc-extensions.md).

See [Guide](../../guide.md) · [Migration guide](../../migration-arc42-only.md).
