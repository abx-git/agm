# Blueprint Pattern

> Architecture documentation as a traversable Markdown graph — for AI agents and humans, versioned with your code.

**Repository:** [github.com/abx-git/blueprint-pattern](https://github.com/abx-git/blueprint-pattern)

Documentation pattern (not a product): compile architecture into linked Markdown in `docs/architecture/`, navigate by explicit links, keep current via `git diff` and agent **workflows**.

---

## Start here

| Document | Purpose |
|----------|---------|
| **[Adoption kit](https://github.com/abx-git/blueprint-pattern/releases/latest/download/blueprint-pattern-adopt.zip)** | **Download** — unpack at app repo root |
| **[Guide](./docs/guide.md)** | Full procedure |
| **[Typical dialog](./docs/typical-dialog.md)** | Example sessions; prompt types explained |
| **[Assistant](https://abx-git.github.io/blueprint-pattern.github.io/)** | Minimal workflow UI — Create (5 steps) · Use (modes) |

```bash
# Download adoption kit → unzip at app repo root → see ADOPT.md
./scripts/bp-workflow.sh checkout bootstrap-init
./scripts/open-assistant.sh                        # workflow UI (browser)
./scripts/build-adoption-package.sh                # build zip locally
```

Optional: [Gen AI challenges](./docs/gen-ai-challenges.md) · [Architects article](./docs/article/blueprint-pattern-for-architects.md) · [Sample app](./docs/examples/sample-app/)

---

## In one sentence

Agents excel at single files but fail on cross-cutting architecture; this pattern **compiles** knowledge into a repo graph and **maintains** it with scoped workflows (`maintenance`, `review`, …).

---

## Repository layout (your application)

```
docs/architecture/
├── blueprint.md       ← phase & session state (not the architecture itself)
├── entry-point.md
├── context/           ← always-on.md
├── prompts/           ← role-*.md
├── work/
├── interfaces/
├── ops/
└── arc42/             ← or c4-light/, adr-first/, lean-service/
```

Templates: [docs/templates/architecture/](./docs/templates/architecture/). Core agent rules: [prompts/core/system-prompt.md](./prompts/core/system-prompt.md).

---

## Scale

Mid-sized apps (~10k–100k LOC) are the easiest start. Large systems: phased bootstrap per domain, **continuous refinement**, one agent session at a time on `blueprint.md`. See [AUTHORS.md](./AUTHORS.md#field-experience).

---

## License

[MIT](./LICENSE) · [Contributions](./CONTRIBUTING.md)
