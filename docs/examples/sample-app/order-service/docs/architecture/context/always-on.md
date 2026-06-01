# Base context — order-service (sample)

## System identity

**Application:** order-service (sample e-commerce)  
**Domain:** Customer order placement, payment coordination, notification triggers  
**Stack:** TypeScript / Node.js, REST to payment-service, message bus for events

## Blueprint

- **Path:** [blueprint.md](../blueprint.md)
- **Entry:** [entry-point.md](../entry-point.md)

## Documentation structure

See [entry-point.md](../entry-point.md#navigation). Operational docs: [ops/](../ops/).

## Source code map

| Component | Path |
|-----------|------|
| Order creation | [src/create_order.ts](../../../src/create_order.ts) |
| Event publishing | [src/publish_order_created.ts](../../../src/publish_order_created.ts) |

## Shell constraints

- Sample only — no production deploy commands

## Session protocol

1. Read [blueprint.md](../blueprint.md) before architecture work.
2. Load [prompts/role-*.md](../prompts/) when the user specifies a role.
3. Traverse the Markdown graph; do not scan the repo blindly.
4. Update Blueprint before stopping.

## On-demand context

[on-demand.md](./on-demand.md)
