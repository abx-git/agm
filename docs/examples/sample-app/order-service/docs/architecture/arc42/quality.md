# Quality Requirements

## Quality tree

```mermaid
flowchart TD
  Q[Quality] --> R[Reliability]
  Q --> P[Performance]
  Q --> M[Maintainability]
  R --> R1[No lost orders]
  R --> R2[Payment correlation]
  P --> P1[500ms order response]
  M --> M1[Traversable architecture docs]
```

## Scenarios

| ID | Scenario | Measure |
|----|----------|---------|
| QS-01 | Order created under normal load | p95 < 500ms |
| QS-02 | Payment service unavailable | Order marked failed, no orphan charges |
| QS-03 | Agent traces payment connection | Full path in < 5 link hops |
