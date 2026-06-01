# Deployment View

## Sample deployment (development)

```mermaid
flowchart LR
  subgraph k8s [Kubernetes Namespace: sample-shop]
    OrderPod[order-service pod]
    PayPod[payment-service pod]
    NotifyPod[notification-service pod]
  end
  Bus[RabbitMQ]
  OrderPod --> PayPod
  OrderPod --> Bus
  PayPod --> Bus
  Bus --> NotifyPod
```

## Infrastructure mapping

| Service | Port | Replicas |
|---------|------|----------|
| order-service | 3001 | 1 |
| payment-service | 3002 | 1 |
| notification-service | 3003 | 1 |

This is illustrative — the sample app contains source and documentation only, no deployment manifests.
