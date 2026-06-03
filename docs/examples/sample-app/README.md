# Sample Application — Order / Payment / Notification

A minimal three-service example demonstrating the Blueprint Pattern in a multi-application ecosystem.

## Services

| Service | Role | Architecture docs |
|---------|------|-------------------|
| [order-service](./order-service/) | Creates orders, orchestrates payment and notification | [docs/architecture](./order-service/docs/architecture/entry-point.md) |
| [payment-service](./payment-service/) | Charges payments, publishes completion events | [docs/architecture](./payment-service/docs/architecture/entry-point.md) |
| [notification-service](./notification-service/) | Sends customer notifications | [docs/architecture](./notification-service/docs/architecture/entry-point.md) |

## Ecosystem map

Start here for cross-service navigation: [ecosystem-index.md](./ecosystem-index.md)

## Try it as an architect

1. Open [order-service/docs/architecture/interfaces/imports.md](./order-service/docs/architecture/interfaces/imports.md)
2. Follow the link to payment-service `exports.md`
3. Follow the source backlink to [`charge_payment.ts`](./payment-service/src/charge_payment.ts)

This is deterministic graph traversal — no RAG, no guessing.

## Try Architecture Work

1. Open [work/2026-05-10-order-payment-trace.md](./order-service/docs/architecture/work/2026-05-10-order-payment-trace.md) (query example)
2. Follow links to [analysis](./order-service/docs/architecture/work/2026-05-15-payment-resilience-analysis.md) and [design](./order-service/docs/architecture/work/2026-05-20-payment-circuit-breaker-design.md)

Prompts: [PROMPT.md § Architecture Work](../../PROMPT.md#4-architecture-work-prompts)

## Try it as an agent

Use the [core system prompt](../../prompts/core/system-prompt.md). Activate a workflow, e.g.:

```bash
./scripts/bp-workflow.sh checkout maintenance
```

Or open [maintenance.md](../../prompts/workflows/maintenance.md) and paste the session block.

Architecture Work: [architecture-work-query.md](../../prompts/workflows/architecture-work-query.md) — example question: *How does order-service notify the customer after payment?*
