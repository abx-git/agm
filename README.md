# Tekto

**Team governance for architecture in Git** — `steer.md`, evidence, `interfaces/`, reviews, and CI checks. Your IDE and model stay where they are; Tekto is the **shared spec surface** agents read and teams verify.

Not an IDE replacement. Positioning: [docs/positioning.md](docs/positioning.md).

## Golden path (copy-paste)

```bash
# 1. Bootstrap
npx @abx-hh/tekto init --project "my-app" --doc-root docs/tekto/ --ai-tool cursor

# 2. Export skills/rules after pack updates
npx @abx-hh/tekto export --ai-tool cursor

# 3. Work from steer
#    Open docs/tekto/steer.md in agent context; keep ## Now ≤ 5 rows

# 4. Aspect review (new chat)
npx @abx-hh/tekto packet aspect security

# 5. CI / local verify
npx @abx-hh/tekto check
```

## CI (GitHub Actions)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: "20"
- run: npx -y @abx-hh/tekto check
```

Optional contract-on-diff when the [Tekto-Validator](docs/reference/tekto-validator.md) binary is licensed:

```yaml
- run: tekto-validator validate --repo . --arch docs/tekto --base origin/main
```

## Daily use

| Step | Command / artifact |
|------|-------------------|
| Orient | `docs/tekto/steer.md` · `tekto next` |
| Contracts | `docs/tekto/interfaces/exports.md` · `imports.md` |
| Work | Tekto skills under `.cursor/skills/tekto/` (or Copilot/Kiro export) |
| Review | `tekto packet aspect <id>` → fresh chat · `reviews/<id>/findings.yaml` |
| Verify | `tekto check` (core · graph · trace · links) |
| Audit | `docs/tekto/log.md` |

## MCP (recommended slim set)

Register only **`@abx-hh/tekto`** — skip legacy workflow MCPs.

```json
{
  "mcpServers": {
    "tekto": {
      "command": "npx",
      "args": ["-y", "@abx-hh/tekto", "tekto-mcp"]
    }
  }
}
```

| Tool | Use |
|------|-----|
| `tekto_load_context` | Load steer + nearby docs |
| `tekto_next` | ## Now rows |
| `tekto_get_packet` | Aspect/revise/summarize packets |
| `tekto_check` | Same as CLI check |
| `tekto_record_finding` | Append to `findings.yaml` |
| `tekto_init` | Scaffold in a new repo |

Details: [docs/reference/tekto-mcp-install.md](docs/reference/tekto-mcp-install.md).

## Studio

Local browser or **GitHub Pages** — **Docs · Review · Composer · Ask AI**. No built-in LLM.

| | |
|-|-|
| Local | `./scripts/open-studio.sh` |
| Hosted | https://abx-git.github.io/agm.github.io/ (Studio + [docs](https://abx-git.github.io/agm.github.io/docs/)) |

[docs/studio/README.md](docs/studio/README.md) · [Pages setup](docs/studio/GITHUB-PAGES-SETUP.md)

## Learn more

| Doc | Purpose |
|-----|---------|
| [quickstart](docs/quickstart.md) | 10-minute walkthrough |
| [guide](docs/guide.md) | Skill loops |
| [multi-repo](docs/reference/multi-repo.md) | Several services |
| [MIGRATION](MIGRATION.md) | From AGM |

---

MIT © Andreas Bergmann, Hamburg, Germany · Package [github.com/abx-git/tekto](https://github.com/abx-git/tekto)