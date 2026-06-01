# WRK-002: Payment integration resilience

| Field | Value |
|-------|-------|
| **ID** | WRK-002 |
| **Type** | analysis |
| **Status** | reviewed |
| **Date** | 2026-05-15 |
| **Author** | sample (Architecture Work) |

## Question / Goal

Analyze failure modes and resilience gaps in the order → payment integration.

## Context

- [building-blocks.md](../arc42/building-blocks.md) — ⚠ no circuit breaker on payment client
- [risks.md](../arc42/risks.md) — payment outage blocks order creation
- [WRK-001](./2026-05-10-order-payment-trace.md) — synchronous REST path

## Findings / Answer / Design

### Failure modes

| Failure | Current behavior | User impact |
|---------|------------------|-------------|
| payment-service timeout | Order creation fails | Customer cannot place order |
| payment-service 5xx | Order marked failed (assumed) | Order lost unless retried |
| Network partition | Same as timeout | High |

### Structural observations

- **Tight coupling:** OrderCreator blocks on payment ([building-blocks.md](../arc42/building-blocks.md))
- **No circuit breaker:** Documented as guardrail finding (phase 5)
- **No idempotency:** Duplicate POST risk ([runtime.md](../arc42/runtime.md))

### Quality attributes affected

- **Availability:** Order API availability ≤ payment-service availability
- **Resilience:** No bulkhead between order and payment paths

## Recommendations

1. Introduce circuit breaker + timeout budget on payment client (see WRK-003)
2. Add idempotency key on order creation
3. Consider async payment option for non-critical paths (would require ADR)

## Traceability

| Claim | Source |
|-------|--------|
| Direct payment coupling | [building-blocks.md](../arc42/building-blocks.md) |
| Payment outage risk | [risks.md](../arc42/risks.md) |
| Synchronous charge path | [WRK-001](./2026-05-10-order-payment-trace.md) |

## Related decisions

- Leads to [WRK-003](./2026-05-20-payment-circuit-breaker-design.md)
