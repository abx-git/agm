# Interface Imports — order-service

External interfaces consumed by this application. All references link to partner `exports.md` files — no duplicated contract definitions.

## From payment-service

| ID | Description | Contract |
|----|-------------|----------|
| API-PAY-001 | Charge payment for order | [payment-service exports](../../../../payment-service/docs/architecture/interfaces/exports.md#api-pay-001-charge-payment) |
| EVT-PAY-001 | Payment completed event | [payment-service exports](../../../../payment-service/docs/architecture/interfaces/exports.md#evt-pay-001-paymentcompleted) |

## From notification-service

| ID | Description | Contract |
|----|-------------|----------|
| API-NOT-001 | Send notification (optional direct call) | [notification-service exports](../../../../notification-service/docs/architecture/interfaces/exports.md#api-not-001-send-notification) |

## Dependency trace

To understand the full payment flow, follow: this file → [payment exports](../../../../payment-service/docs/architecture/interfaces/exports.md) → [charge_payment.ts](../../../../payment-service/src/charge_payment.ts)
