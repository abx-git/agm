# Bounded context — Order

## Scope

Customer order placement and lifecycle within order-service. Payment execution and notification delivery are **out of scope** (partner contexts).

**Implementation:** order-service — [create_order.ts](../../../../../src/create_order.ts), [publish_order_created.ts](../../../../../src/publish_order_created.ts)

Links: [context-map.md](../../context-map.md) · [language.md](./language.md)

## Aggregates

| Aggregate | Root entity | Invariants | Consistency boundary |
|-----------|-------------|------------|----------------------|
| Order | Order | Must have ≥1 line; total > 0 before placement | Order + OrderLines in one transaction |

## Domain events (published)

| Event | When | Integration? |
|-------|------|--------------|
| OrderCreated (EVT-ORD-001) | After successful placement | yes — [exports.md](../../../interfaces/exports.md) |

## Open questions

- Payment failure compensation policy not modelled as domain policy yet (see WRK-002).
