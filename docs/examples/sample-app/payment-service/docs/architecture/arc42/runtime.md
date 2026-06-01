# Runtime View — payment-service

## UC-01: Charge Payment

```mermaid
sequenceDiagram
  participant Order as order-service
  participant Payment as payment-service
  participant Gateway as Payment Gateway
  participant Bus as Message Bus

  Order->>Payment: API-PAY-001 ChargePayment
  Payment->>Gateway: Authorize & capture
  Gateway-->>Payment: Success
  Payment->>Bus: EVT-PAY-001 PaymentCompleted
  Payment-->>Order: PaymentResult
```

## Source mapping

| Step | File |
|------|------|
| Process charge | [charge_payment.ts](../../../src/charge_payment.ts) |
| Publish event | [publish_payment_completed.ts](../../../src/publish_payment_completed.ts) |
