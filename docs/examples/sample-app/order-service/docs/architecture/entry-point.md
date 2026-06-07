# order-service — Architecture Entry Point

## Documentation template

Selected template: arc42  
Rationale: Sample ecosystem uses full arc42 sections for teaching; C4 diagrams in context and runtime views.  
Attribution: [arc42](https://arc42.org) (Gernot Starke, Peter Hruschka, [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)); [C4 model](https://c4model.com/) (Simon Brown).

---

C4 Level 1 context view for the order service in the sample ecosystem.

## Purpose

The order service accepts customer orders, coordinates payment through [payment-service](../../../payment-service/docs/architecture/entry-point.md), and triggers notifications via [notification-service](../../../notification-service/docs/architecture/entry-point.md).

## System context

```mermaid
C4Context
  title Order Service — System Context
  Person(customer, "Customer", "Places orders")
  System(order, "order-service", "Manages order lifecycle")
  System_Ext(payment, "payment-service", "Processes payments")
  System_Ext(notify, "notification-service", "Sends notifications")
  Rel(customer, order, "Creates orders")
  Rel(order, payment, "Charges payment", "REST")
  Rel(order, notify, "Order created event", "Message bus")
```

## Navigation

| Section | File |
|---------|------|
| Blueprint (progress) | [blueprint.md](./blueprint.md) |
| Base context | [context/always-on.md](./context/always-on.md) |
| Interface exports | [interfaces/exports.md](./interfaces/exports.md) |
| Interface imports | [interfaces/imports.md](./interfaces/imports.md) |
| Domain — context map | [domain/context-map.md](./domain/context-map.md) |
| Domain — Order model | [domain/contexts/order/model.md](./domain/contexts/order/model.md) |
| Domain — events | [domain/events.md](./domain/events.md) |
| Introduction | [arc42/introduction.md](./arc42/introduction.md) |
| Building blocks | [arc42/building-blocks.md](./arc42/building-blocks.md) |
| Runtime | [arc42/runtime.md](./arc42/runtime.md) |
| Decisions | [arc42/decisions/001-async-messaging.md](./arc42/decisions/001-async-messaging.md) |
| Architecture Work | [work/README.md](./work/README.md) |
| Operations | [ops/troubleshooting.md](./ops/troubleshooting.md) · [ops/pitfalls.md](./ops/pitfalls.md) |
| Ecosystem index | [ecosystem-index.md](../../../ecosystem-index.md) |

## Source code

| Component | Source |
|-----------|--------|
| Order creation | [create_order.ts](../../src/create_order.ts) |
| Event publishing | [publish_order_created.ts](../../src/publish_order_created.ts) |
