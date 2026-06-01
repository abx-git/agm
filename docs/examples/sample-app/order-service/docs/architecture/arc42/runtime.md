# Runtime View

## UC-01: Create Order

```mermaid
sequenceDiagram
  participant Client
  participant Order as order-service
  participant Payment as payment-service
  participant Bus as Message Bus
  participant Notify as notification-service

  Client->>Order: POST /orders
  Order->>Order: Persist order (pending)
  Order->>Payment: API-PAY-001 ChargePayment
  Payment->>Payment: charge_payment.ts
  Payment-->>Order: PaymentResult
  Payment->>Bus: EVT-PAY-001 PaymentCompleted
  Order->>Bus: EVT-ORD-001 OrderCreated
  Bus->>Notify: OrderCreated
  Notify->>Notify: send_notification.ts
  Order-->>Client: 201 Created
```

## Source mapping

| Step | Implementation |
|------|----------------|
| Create order | [create_order.ts](../../../src/create_order.ts) |
| Charge payment | [charge_payment.ts](../../../payment-service/src/charge_payment.ts) |
| Publish OrderCreated | [publish_order_created.ts](../../../src/publish_order_created.ts) |
| Send notification | [send_notification.ts](../../../notification-service/src/send_notification.ts) |

### ⚠ Architecture notes

- No idempotency key on order creation — duplicate POST could create duplicate orders
