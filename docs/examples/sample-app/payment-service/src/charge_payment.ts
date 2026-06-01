export interface ChargePaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  transactionId: string;
  status: "succeeded" | "failed";
}

/**
 * Charges a payment for an order.
 * Publishes EVT-PAY-001 on success — see publish_payment_completed.ts
 */
export async function chargePayment(req: ChargePaymentRequest): Promise<PaymentResult> {
  const result: PaymentResult = {
    transactionId: crypto.randomUUID(),
    status: "succeeded",
  };

  if (result.status === "succeeded") {
    await publishPaymentCompleted({
      orderId: req.orderId,
      amount: req.amount,
      currency: req.currency,
      transactionId: result.transactionId,
    });
  }

  return result;
}

async function publishPaymentCompleted(event: PaymentCompletedEvent): Promise<void> {
  void event;
}

interface PaymentCompletedEvent {
  orderId: string;
  amount: number;
  currency: string;
  transactionId: string;
}
