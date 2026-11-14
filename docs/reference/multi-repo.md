# Multi-repo pattern

Tekto targets **team leads across several repositories** — one doc root per app, linked contracts, shared checks in CI.

## Per service repository

```bash
npx @abx-hh/tekto init --project "order-service" --doc-root docs/tekto/ --ai-tool cursor
```

Minimum layout:

```
docs/tekto/
  steer.md
  log.md
  interfaces/
    exports.md    # what this repo exposes
    imports.md    # what it depends on (paths or URLs to partner exports)
```

Partner references use **relative paths across checkouts** or stable URLs in Git:

```markdown
| API-PAY-001 | [payment exports](https://github.com/org/payment/blob/main/docs/tekto/interfaces/exports.md#api-pay-001) |
```

`tekto check` resolves evidence and links from the **consumer repo root** — keep paths valid in your monorepo or document URL-only evidence.

## Optional contracts repository

Some teams mirror interface IDs in a dedicated repo:

```
architecture-contracts/
  contracts/
    API-PAY-001.yaml
```

Run the commercial validator against the **service repo** with `--arch docs/tekto` for contract compliance on diff. Open-source gate:

```bash
tekto check
tekto check --with-validator   # when tekto-validator is installed
```

Future CLI flag `--contracts-root` may point at a shared checkout; until then, duplicate contract tables in `interfaces/` and link from WRK/ADRs.

## Sample app

The monorepo under `docs/examples/sample-app/` shows three services sharing Tekto layout and cross-links. Run checks from repo root with `.tekto/config.json` → `docRoot: docs/tekto/` for the meta project, or point `docRoot` at each service path when validating examples.