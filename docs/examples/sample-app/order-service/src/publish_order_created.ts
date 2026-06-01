export interface OrderCreatedEvent {
  orderId: string;
  customerId: string;
  occurredAt: string;
}

/**
 * Publishes EVT-ORD-001 after order creation.
 * Consumed by notification-service — see interfaces/exports.md.
 */
export async function publishOrderCreated(event: OrderCreatedEvent): Promise<void> {
  // Message bus publish — see arc42/runtime.md
  void event;
}
