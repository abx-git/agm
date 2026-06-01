# Constraints

## Technical

- TypeScript / Node.js runtime
- REST for synchronous payment calls
- Message bus for async events (OrderCreated, PaymentCompleted)

## Organizational

- Sample application — no production SLA
- Documentation maintained via the Blueprint Pattern

## Conventions

- arc42 for structure (Starke, Hruschka); C4 for diagrams (Simon Brown) — see [introduction.md](./introduction.md#documentation-template)
- Unique interface IDs: `API-ORD-*`, `EVT-ORD-*`
