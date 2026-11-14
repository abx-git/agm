# Tekto — 10-minute quickstart

Tekto keeps architecture work **in Git** with evidence agents can follow. This path is copy-paste friendly and ends with **CI-ready** `tekto check`.

## 0. Prerequisites

- Node.js 20+
- A git repository (app or monorepo)

## 1. Init + export

```bash
npx @abx-hh/tekto init --project "my-app" --doc-root docs/tekto/ --ai-tool cursor
npx @abx-hh/tekto export --ai-tool cursor
```

Creates `docs/tekto/steer.md`, `log.md`, review scaffolding, and copies skills to `.cursor/skills/tekto/`.

Other targets: `claude` · `copilot` · `kiro` · `generic`.

## 2. Steer

Open `docs/tekto/steer.md`. Use **## Now** for at most five parallel tasks. Append one-liners to `log.md` when you change structure or close a review.

```bash
npx @abx-hh/tekto next
```

## 3. Skills (agent loops)

| Loop | Skill | Trigger |
|------|-------|---------|
| Understand | `understand` | New system or service |
| Decide | `decide` | ADR-worthy choice |
| Review | `review-aspect` | `tekto packet aspect <aspect>` |
| Evolve | `evolve-sync` | After `git diff` on main paths |

Aspects live in `packs/aspects/` (bundled with the CLI).

## 4. Review packet

```bash
npx @abx-hh/tekto packet aspect security
```

Paste into a **new** chat (author chat ≠ revise chat). Store output under `docs/tekto/reviews/<id>/findings.yaml` — or use Studio **Review** / MCP `tekto_record_finding`.

## 5. Check (local + CI)

```bash
npx @abx-hh/tekto check
```

Runs **core** (steer/log, evidence, reviews), **graph** (index, work registry), **trace** (active WRK items), and **links**.

Subset:

```bash
npx @abx-hh/tekto check --check trace
npx @abx-hh/tekto check --with-validator   # + contract binary if installed
```

### GitHub Actions

```yaml
name: tekto
on:
  pull_request:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npx -y @abx-hh/tekto check
```

## 6. Log (audit)

```bash
npx @abx-hh/tekto log --type review --path reviews/2026-01-security --note "initial findings"
```

Format: `YYYY-MM-DD | type | path | note` in `log.md`.

## Hosted Tekto (GitHub Pages)

| | URL |
|-|-----|
| Studio | https://abx-git.github.io/agm.github.io/ |
| Docs | https://abx-git.github.io/agm.github.io/docs/ |

Build locally: `cd docs/studio && npm run build:pages`.

## Next

- [positioning.md](./positioning.md) — what Tekto is / is not
- [guide.md](./guide.md) — full skill table
- [reference/multi-repo.md](./reference/multi-repo.md) — several repositories
- [reference/tekto-validator.md](./reference/tekto-validator.md) — optional contract enforcement