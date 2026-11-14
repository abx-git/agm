# @abx-hh/tekto

CLI and MCP for Tekto — AI-supported architecture documentation and review.

```bash
npx @abx-hh/tekto init --ai-tool cursor
tekto export --ai-tool cursor   # also: claude | copilot | kiro | generic
tekto check                    # core + graph + trace + links
tekto check --check trace      # subset
tekto check --with-validator   # + contract binary when installed
tekto packet aspect security
```

MCP tools: `tekto_load_context`, `tekto_next`, `tekto_get_packet`, `tekto_check`, `tekto_init`, `tekto_record_finding`.