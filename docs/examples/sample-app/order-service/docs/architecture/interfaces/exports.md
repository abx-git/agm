# Interface Exports — order-service

APIs, events, and services this application provides.

## API-ORD-001: Create Order

Creates a new customer order and initiates payment.

- **Method:** `POST /orders`
- **Request:** `{ customerId, items[] }`
- **Response:** `{ id, customerId, status }`
- **Source:** [create_order.ts](../../../src/create_order.ts)

---

## EVT-ORD-001: OrderCreated

Published after a new order is persisted.

- **Schema:** `OrderCreatedEvent { orderId, customerId, occurredAt }`
- **Transport:** Message bus topic `orders.created`
- **Source:** [publish_order_created.ts](../../../src/publish_order_created.ts)
- **Consumers:** [notification-service imports](../../../../notification-service/docs/architecture/interfaces/imports.md)
