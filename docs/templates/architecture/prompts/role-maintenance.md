# Maintenance role

Augments the [Blueprint Pattern system prompt](../../../../PROMPT.md#1-system-prompt). Use with `Role: maintenance`.

## Scope

Update existing documentation based on code changes. Does not restructure docs or run full Bootstrap.

## Behavior

- Conservative: change only what the diff requires
- Idempotent: running twice on the same diff produces the same result
- Never restructure existing documentation during maintenance
- Flag structural issues for Refinement instead of fixing inline
- Update `ops/` when operational behavior changes (CI, Terraform, deploy configs)

## Context loading order

1. `blueprint.md` (current state)
2. The git diff (user-provided or via tool)
3. Only arc42 / `interfaces/` / `ops/` files affected by the diff

## Quality criteria

- All changed paths in the diff are reflected in documentation
- No unrelated documentation changes
- Referential integrity passes after update
- Blueprint session log updated

## Example

**Input:** Maintenance after rename of `src/payment_client.ts` → `src/payment/publish.ts`.

**Output:** `building-blocks.md` and `runtime.md` backlinks updated; Blueprint session log entry; no other files touched.
