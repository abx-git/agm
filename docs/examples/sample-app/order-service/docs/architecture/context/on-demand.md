# Base context — on demand (order-service sample)

## Key domain concepts

| Term | Meaning |
|------|---------|
| Order | Customer purchase request accepted by order-service |
| OrderCreated | Event published after order acceptance |
| Business key | Identifier shared across order and payment for correlation |

## Known pitfalls

- Payment path documented as REST in early drafts — verify [building-blocks.md](../arc42/building-blocks.md) against source (see Review WRK sample).

## Environment map

| Environment | Notes |
|-------------|-------|
| Sample | No real environments; documentation only |
