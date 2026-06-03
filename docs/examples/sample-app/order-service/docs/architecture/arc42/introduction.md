# Introduction and Goals

## Documentation template

See [entry-point.md](../entry-point.md#documentation-template) for selected template (`arc42`) and attribution. This introduction is project-specific, not copied from the official arc42 template.

## Requirements overview

The order service is the entry point for customer purchases in the sample e-commerce ecosystem. It creates orders, delegates payment to payment-service, and notifies customers via notification-service.

## Quality goals

| Priority | Goal | Scenario |
|----------|------|----------|
| 1 | Reliability | Orders are never lost after acceptance |
| 2 | Traceability | Every order links to a payment transaction |
| 3 | Responsiveness | Order creation responds within 500ms (excluding payment) |

## Stakeholders

| Role | Expectations |
|------|--------------|
| Customer | Simple order placement |
| Operations | Observable order/payment correlation |
| Architect | Clear cross-service contracts |
