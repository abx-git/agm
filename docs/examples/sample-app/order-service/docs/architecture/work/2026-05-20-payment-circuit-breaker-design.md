# WRK-003: Circuit breaker for payment client

| Field | Value |
|-------|-------|
| **ID** | WRK-003 |
| **Type** | design |
| **Status** | draft |
| **Date** | 2026-05-20 |
| **Author** | sample (Architecture Work) |

## Question / Goal

Design a circuit breaker between order-service and payment-service without changing the external API contract (API-ORD-001).

## Context

- [WRK-002](./2026-05-15-payment-resilience-analysis.md) — analysis findings
- [imports.md](../interfaces/imports.md) — API-PAY-001 unchanged externally
- [building-blocks.md](../arc42/building-blocks.md) — OrderCreator / payment adapter

## Findings / Answer / Design

### Target structure

Extract payment calls into `PaymentClient` with embedded circuit breaker (closed / open / half-open).

```mermaid
flowchart LR
  OrderCreator[OrderCreator] --> PC[PaymentClient]
  PC --> CB[Circuit Breaker]
  CB --> REST[API-PAY-001 REST]
```

### Behavior

| State | On call | Order API response |
|-------|---------|-------------------|
| Closed | Forward to payment-service | Normal |
| Open | Fail fast (no call) | 503 + retry-after header |
| Half-open | Single trial call | Normal or back to open |

### Configuration (draft)

- Failure threshold: 5 failures in 30s
- Open duration: 60s
- Timeout: 3s per charge call

## Recommendations

1. Implement PaymentClient in new file `src/payment_client.ts`
2. Update [building-blocks.md](../arc42/building-blocks.md) after implementation
3. Promote to ADR when approved

## Alternatives considered

| Alternative | Rejected because |
|-------------|------------------|
| Async payment only | Larger behavior change; needs product sign-off |
| Retry without breaker | Amplifies load on failing payment-service |

## Impact

- **Components:** OrderCreator, new PaymentClient
- **Interfaces:** API-PAY-001 contract unchanged
- **Operations:** Metrics for breaker state required

## Related decisions

- Draft ADR recommended: `arc42/decisions/002-circuit-breaker-payment.md` (not yet created)

## Traceability

| Claim | Source |
|-------|--------|
| Current coupling | [WRK-002](./2026-05-15-payment-resilience-analysis.md) |
| API contract | [exports.md](../interfaces/exports.md), [payment API-PAY-001](../../../../payment-service/docs/architecture/interfaces/exports.md) |
