# Architecture templates

Installed into your application by [bp-install.sh](../../../scripts/bp-install.sh) (or the Assistant UI generator) as `<doc-root>/` before the adoption session.

## Core files (all templates)

| Path | Purpose |
|------|---------|
| [context/always-on.md](./context/always-on.md) | Session orientation |
| [context/on-demand.md](./context/on-demand.md) | Domain / environment (on demand) |
| [prompts/role-*.md](./prompts/) | Operational role prompts |
| `blueprint.md` | Construction plan + state (see [blueprint-format](../../../prompts/reference/blueprint-format.md)) |
| `entry-point.md` | Human entry: overview, navigation, source links + ## Documentation template |
| `interfaces/exports.md` · `imports.md` | Contracts |
| [work/](./work/) | Architecture Work + Review |

## Documentation templates (pick one)

| Template | Folder | Blueprint phases |
|----------|--------|------------------|
| `arc42` (default) | Use existing [sample introduction](../../../examples/sample-app/order-service/docs/architecture/arc42/introduction.md) | 1–12 + ops optional |
| `c4-light` | [c4-light/](./c4-light/) | Context → containers → components → decisions |
| `adr-first` | [adr-first/](./adr-first/) | Decisions → context → views |
| `lean-service` | [lean-service/](./lean-service/) | Overview → runtime → decisions |
| `custom` | Your layout | Define rows in `blueprint.md` |

## Optional

| Path | Extension |
|------|-----------|
| [ops/](./ops/) | Operational knowledge |
| [work/_template-review.md](./work/_template-review.md) | Review reports |

See [Guide](../../guide.md) · [Migration guide](../../migration-arc42-only.md).
