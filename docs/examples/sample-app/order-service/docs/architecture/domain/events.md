# Domain events — order-service

| ID | Name | Context | Type | Payload summary | Consumers | Source |
|----|------|---------|------|-----------------|-----------|--------|
| EVT-ORD-001 | OrderCreated | Order | integration | orderId, customerId, amount | notification-service | [publish_order_created.ts](../../../../src/publish_order_created.ts) |

See [arc42/concepts.md](../arc42/concepts.md) for topic naming.
