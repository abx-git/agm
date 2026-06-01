# Cross-cutting Concepts

## Error handling

Payment failures propagate to the caller. Order status set to `failed` when charge fails.

## Logging

Structured JSON logs with correlation ID spanning order → payment → notification.

## Messaging

- Topic naming: `{domain}.{event}` (e.g. `orders.created`, `payments.completed`)
- At-least-once delivery; consumers must be idempotent

## Interface ID convention

| Prefix | Meaning |
|--------|---------|
| API-* | Synchronous REST/RPC |
| EVT-* | Async domain event |
| SVC-* | Long-running service contract |
