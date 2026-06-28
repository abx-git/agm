# ADR-001: Async Messaging for Notifications

## Status

Accepted

## Context

After order creation, customers must receive confirmation. Notification delivery is slow and failure-prone compared to payment processing.

## Decision

Use asynchronous messaging (EVT-ORD-001 on message bus) to trigger notification-service instead of synchronous REST calls.

## Consequences

**Positive:**
- Order API response not blocked by notification latency
- notification-service can scale independently

**Negative:**
- Eventual consistency — customer may see order before email arrives
- Requires message bus infrastructure

## Related

- [runtime.md](../runtime.md)
- [notification-service exports](../../../../../notification-service/docs/architecture/interfaces/exports.md)
