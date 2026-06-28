# Runtime View — notification-service

## UC-01: Order Confirmation Notification

```mermaid
sequenceDiagram
  participant Bus as Message Bus
  participant Notify as notification-service
  participant Email as Email Provider

  Bus->>Notify: EVT-ORD-001 OrderCreated
  Notify->>Notify: send_notification.ts
  Notify->>Email: Send confirmation email
```

## Source mapping

| Step | File |
|------|------|
| Handle event, send notification | [send_notification.ts](../../../src/send_notification.ts) |
| Event publisher (upstream) | [publish_order_created.ts](../../../../order-service/src/publish_order_created.ts) |
