# Context map

<!-- Strategic DDD: bounded contexts and relationships. Maintain via domain-work-context-map or Refinement. -->

## Bounded contexts

| Context | Responsibility | Implementation (module / service) | Language |
|---------|----------------|-----------------------------------|----------|
| — | — | — | — |

## Context map

```mermaid
flowchart LR
  subgraph contexts [Bounded contexts]
    A[Context A]
    B[Context B]
  end
  A -->|relationship| B
```

**Relationship legend:** use DDD integration patterns — Partnership · Customer-Supplier · Conformist · Anti-Corruption Layer · Open Host Service · Shared Kernel · Separate Ways

| Upstream | Downstream | Pattern | Contract |
|----------|------------|---------|----------|
| — | — | — | [interfaces/](../interfaces/) |

## Notes

- Link each context to [exports.md](../interfaces/exports.md) / [imports.md](../interfaces/imports.md) where applicable.
- Team ownership: <!-- optional Conway alignment -->
