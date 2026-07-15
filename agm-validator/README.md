# AGM-Validator (proprietary)

Deterministic architecture enforcement for the [Architecture Graph Method](https://github.com/abx-git/agm).
**Commercial component** — see [LICENSE](./LICENSE). Public integration guide: [docs/reference/agm-validator.md](../docs/reference/agm-validator.md).

## One binary, two modes

```bash
agm-validator validate --staged          # CLI / Git hook / CI
agm-validator validate --json            # machine-readable report
agm-validator mcp                        # MCP server (stdio)
agm-validator version
```

## Build

```bash
make build          # local binary
make test           # run tests
make release        # cross-compile to dist/
```

## Checks

| Check | Status |
|-------|--------|
| `contract` — exports.md / imports.md vs git diff | **implemented** |
| `trace` — WRK recommendations vs diff | planned |
| `graph` — index.md, log.md, link integrity | planned |

```bash
agm-validator validate --check contract --check trace
```

## Layout

```text
agm-validator/
├── cmd/agm-validator/     # entry
├── internal/
│   ├── cli/               # validate | mcp | version
│   ├── validate/          # orchestration (shared by CLI + MCP)
│   ├── mcp/               # stdio JSON-RPC MCP server
│   ├── contract/          # exports.md parser + rules
│   ├── git/               # diff loader
│   └── report/            # text + JSON output
├── LICENSE                # proprietary
└── Makefile               # release builds
```

## MCP tools

- `agm_validate_diff` — run validation checks
- `agm_validator_status` — version and capability matrix

Cursor config:

```json
{
  "mcpServers": {
    "agm-validator": {
      "command": "/usr/local/bin/agm-validator",
      "args": ["mcp"]
    }
  }
}
```

## Open vs commercial

| Open (MIT, parent repo) | Commercial (this component) |
|-------------------------|----------------------------|
| Graph structure, templates | Parser heuristics |
| `@abx-hh/agm-cli` workflows | Rule engine |
| `agm_verify_links` | Contract / trace / graph enforcement |
