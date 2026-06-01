# Troubleshooting (sample)

## Order created but customer not notified

### Start here

1. Check: Was `OrderCreated` published?
   - **No** → Inspect [publish_order_created.ts](../../../src/publish_order_created.ts) and [runtime.md](../arc42/runtime.md)
   - **Yes** → Continue to step 2

2. Check: Does [notification-service](../../../../notification-service/docs/architecture/interfaces/exports.md) list the subscription?
   - **No** → Update interface contracts (Maintenance)
   - **Yes** → Continue to step 3

3. Check: notification-service [runtime](../../../../notification-service/docs/architecture/arc42/runtime.md) for delivery failures

### Related

- Normal flow: [arc42/runtime.md](../arc42/runtime.md)
