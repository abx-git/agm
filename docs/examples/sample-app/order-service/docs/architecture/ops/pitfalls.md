# Known pitfalls (sample)

## Payment client timeout blocks order creation

- **Trigger:** payment-service slow or unavailable
- **Effect:** Order creation blocks; no OrderCreated event
- **Detection:** Elevated latency on create-order path; see [runtime.md](../arc42/runtime.md)
- **Mitigation:** Circuit breaker (proposed in [WRK-003 design](../work/2026-05-20-payment-circuit-breaker-design.md))
- **Source:** [create_order.ts](../../../src/create_order.ts)
- **Status:** Open — guardrail finding in blueprint.md
