# Architecture templates

Copy into your application as `docs/architecture/` during Bootstrap.

## Core files (all templates)

| Path | Purpose |
|------|---------|
| [context/always-on.md](./context/always-on.md) | Session orientation |
| [context/on-demand.md](./context/on-demand.md) | Domain / environment (on demand) |
| [prompts/role-*.md](./prompts/) | Operational role prompts |
| `blueprint.md` | State tracking (see [PROMPT.md](../../../PROMPT.md#2-blueprint-file-format)) |
| `entry-point.md` | Navigation + ## Documentation template |
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

See [Blueprint Pattern Extensions](../../blueprint-pattern-extensions.md) · [PROMPT.md](../../../PROMPT.md) · [Migration guide](../../migration-arc42-only.md).
