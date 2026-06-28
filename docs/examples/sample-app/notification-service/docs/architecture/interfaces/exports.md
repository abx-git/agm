# Interface Exports — notification-service

## API-NOT-001: Send Notification

Sends a notification to a customer (optional direct call; primary path is event-driven).

- **Method:** `POST /notifications/send`
- **Request:** `SendNotificationRequest { customerId, channel, template, payload }`
- **Source:** [send_notification.ts](../../../src/send_notification.ts)

---

## SVC-NOT-001: Notification Delivery

Async consumer of domain events — primary integration mode.

- **Subscribes to:** [EVT-ORD-001](../../../../order-service/docs/architecture/interfaces/exports.md#evt-ord-001-ordercreated)
- **Source:** [send_notification.ts](../../../src/send_notification.ts)
