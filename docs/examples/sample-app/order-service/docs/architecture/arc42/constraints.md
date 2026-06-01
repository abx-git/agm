# Constraints

## Technical

- TypeScript / Node.js runtime
- REST for synchronous payment calls
- Message bus for async events (OrderCreated, PaymentCompleted)

## Organizational

- Sample application — no production SLA
- Documentation maintained via the Blueprint Pattern

## Conventions

- arc42 for structure, C4 for diagrams
- Unique interface IDs: `API-ORD-*`, `EVT-ORD-*`
