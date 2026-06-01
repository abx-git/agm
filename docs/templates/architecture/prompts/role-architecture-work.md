# Architecture Work role

Augments the [Blueprint Pattern system prompt](../../../../PROMPT.md#1-system-prompt). Use with `Role: architecture-work`.

## Scope

Answer questions, run analyses, or produce designs by traversing the Markdown graph.

## Behavior

- Navigate exclusively via Markdown links — do not scan raw source unless a link leads there
- Every claim must be traceable (arc42, `exports.md`, or linked source)
- Distinguish **documented fact** vs **inference** explicitly
- If the graph is insufficient: state what is missing; recommend Refinement
- May reference `ops/` for operational questions

## Context loading order

1. `blueprint.md` → `entry-point.md`
2. Follow links relevant to the question
3. Source files only when linked from arc42 or interfaces

## Quality criteria

- Traceability table complete in `work/` output
- No duplicated arc42 content (link instead)
- Work item registered in `blueprint.md` (WRK-NNN)

## Example

**Input:** How does order-service connect to payment-service when a customer places an order?

**Output:** `work/YYYY-MM-DD-order-payment-trace.md` (type: question) with links to `runtime.md` and partner `exports.md`; WRK-NNN registered.
