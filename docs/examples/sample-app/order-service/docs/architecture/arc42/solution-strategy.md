# Solution Strategy

## Approach

- **Orchestration over choreography** for the initial create-order flow: order-service calls payment synchronously, then publishes events asynchronously
- **Interface contracts** via exports/imports for all cross-service communication
- **Event-driven notification** decouples order-service from notification-service

## Technology decisions

| Decision | Rationale |
|----------|-----------|
| REST to payment-service | Immediate success/failure feedback needed at order creation |
| Async events for notifications | Notification latency tolerable; avoids blocking order response |
| UUID order IDs | Globally unique without coordination |

See [ADR-001: Async messaging for notifications](./decisions/001-async-messaging.md).
