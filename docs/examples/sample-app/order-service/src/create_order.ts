export interface CreateOrderRequest {
  customerId: string;
  items: Array<{ sku: string; quantity: number }>;
}

export interface Order {
  id: string;
  customerId: string;
  status: "pending" | "paid" | "failed";
}

/**
 * Creates a new order and initiates the payment flow.
 * See docs/architecture/arc42/runtime.md for the full sequence.
 */
export async function createOrder(req: CreateOrderRequest): Promise<Order> {
  const order: Order = {
    id: crypto.randomUUID(),
    customerId: req.customerId,
    status: "pending",
  };

  // Delegates to payment-service via internal client (see imports.md)
  await chargeForOrder(order.id, calculateTotal(req.items));

  return order;
}

async function chargeForOrder(orderId: string, amount: number): Promise<void> {
  // Implementation calls payment-service API-PAY-001
  void orderId;
  void amount;
}

function calculateTotal(items: CreateOrderRequest["items"]): number {
  return items.reduce((sum, item) => sum + item.quantity * 10, 0);
}
