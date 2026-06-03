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

1. Read always-on.md → [blueprint.md](../blueprint.md) → `prompts/role-<role>.md` when role given.
2. If no role: request bootstrap | maintenance | architecture-work | review.
3. Traverse the Markdown graph; output [[ANCHOR:LINK_CHECK]] before stop.
4. Update Blueprint; emit [[ANCHOR:CHANGED_FILES]] and [[ANCHOR:OPEN_QUESTIONS]].

## On-demand context

[on-demand.md](./on-demand.md)
