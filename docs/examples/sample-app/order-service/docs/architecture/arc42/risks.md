# Risks and Technical Debt

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment service outage blocks order creation | High | Circuit breaker, async payment option |
| Duplicate orders on retry | Medium | Idempotency keys |
| Stale interface contracts | Medium | AGM maintenance on git diff + CI link check |

## Technical debt

- Payment client embedded in OrderCreator — extract to dedicated adapter
- No dead-letter queue for failed notifications
