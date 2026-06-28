# Interface Exports — payment-service

## API-PAY-001: Charge Payment

Charges a payment for an order.

- **Method:** `POST /payments/charge`
- **Request:** `ChargePaymentRequest { orderId, amount, currency }`
- **Response:** `PaymentResult { transactionId, status }`
- **Source:** [charge_payment.ts](../../../src/charge_payment.ts)
- **Consumers:** [order-service imports](../../../../order-service/docs/architecture/interfaces/imports.md)

---

## EVT-PAY-001: PaymentCompleted

Published when a charge succeeds.

- **Schema:** `PaymentCompletedEvent { orderId, amount, currency, transactionId }`
- **Transport:** Message bus topic `payments.completed`
- **Source:** [publish_payment_completed.ts](../../../src/publish_payment_completed.ts)
- **Consumers:** [order-service imports](../../../../order-service/docs/architecture/interfaces/imports.md)
