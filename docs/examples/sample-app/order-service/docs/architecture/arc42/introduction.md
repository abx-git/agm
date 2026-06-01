# Introduction and Goals

## Documentation template

This sample uses [arc42](https://arc42.org) and the [C4 model](https://c4model.com/) as
conventions — they are **not required** by the Blueprint Pattern, but they provide a proven
basis for structured architecture documentation. arc42 (Gernot Starke, Peter Hruschka) is
licensed under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); the C4 model
was created by Simon Brown. Wording in this file is project-specific, not copied from the
official arc42 template.

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
