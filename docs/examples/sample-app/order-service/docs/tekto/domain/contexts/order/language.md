# Ubiquitous language — Order context

| Term | Definition | Not synonymous with | Code / API examples |
|------|------------|---------------------|---------------------|
| Order | Customer request to purchase goods/services | Payment, Shipment | create_order |
| OrderCreated | Domain event: order persisted and accepted | PaymentCompleted | EVT-ORD-001 |
| Placement | Act of accepting an order (business) | Charge (Payment context) | OrderCreator |
