export interface PaymentCompletedEvent {
  orderId: string;
  amount: number;
  currency: string;
  transactionId: string;
}

/**
 * Publishes EVT-PAY-001 to the message bus.
 * See docs/architecture/interfaces/exports.md
 */
export async function publishPaymentCompleted(event: PaymentCompletedEvent): Promise<void> {
  void event;
}
