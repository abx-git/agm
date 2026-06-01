export interface SendNotificationRequest {
  customerId: string;
  channel: "email" | "sms";
  template: string;
  payload: Record<string, string>;
}

/**
 * Sends a customer notification.
 * Triggered by EVT-ORD-001 from order-service — see imports.md
 */
export async function sendNotification(req: SendNotificationRequest): Promise<void> {
  void req;
}
