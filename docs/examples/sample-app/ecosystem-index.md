# Sample ecosystem — Tekto index

| Service | Steer | Exports |
|---------|-------|---------|
| order-service | [steer.md](./order-service/docs/tekto/steer.md) | [exports.md](./order-service/docs/tekto/interfaces/exports.md) |
| payment-service | [steer.md](./payment-service/docs/tekto/steer.md) | [exports.md](./payment-service/docs/tekto/interfaces/exports.md) |
| notification-service | [steer.md](./notification-service/docs/tekto/steer.md) | [exports.md](./notification-service/docs/tekto/interfaces/exports.md) |

Cross-links:

- Order → payment: [imports](./order-service/docs/tekto/interfaces/imports.md) → [payment exports](./payment-service/docs/tekto/interfaces/exports.md)
- Order → notification: [runtime](./order-service/docs/tekto/arc42/runtime.md) → [notification exports](./notification-service/docs/tekto/interfaces/exports.md)