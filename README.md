# Blueprint Pattern

> Architecture documentation as a traversable Markdown graph — for AI agents and humans, versioned with your code.

**Repository:** [github.com/abx-git/blueprint-pattern](https://github.com/abx-git/blueprint-pattern)

Compile architecture into linked Markdown in `docs/architecture/`, navigate by explicit links, maintain through a **three-phase lifecycle** with agent session prompts.

---

## Start here

| Document | Purpose |
|----------|---------|
| **[Assistant](https://abx-git.github.io/blueprint-pattern.github.io/)** | **Start here** — Build · Evolve · Work + copy prompts |
| **[Adoption prompt](./prompts/adopt-standalone.md)** | Paste into first agent chat (or use Assistant form) |
| **[Guide](./docs/guide.md)** | Lifecycle, core files, full procedure |

```bash
./scripts/open-assistant.sh   # local UI at http://localhost:8765
```

Optional: [Typical dialog](./docs/typical-dialog.md) · [Gen AI challenges](./docs/gen-ai-challenges.md) · [Sample app](./docs/examples/sample-app/)

---

## Three phases

| Phase | What | Lead file |
|-------|------|-----------|
| **1 · Build** | Create doc graph iteratively (bootstrap) | `blueprint.md` — construction plan |
| **2 · Evolve** | Refine sections, sync with `git diff` | `entry-point.md` + template chapters |
| **3 · Work** | Questions, analysis, design on compiled graph | `work/` + WRK in `blueprint.md` |

---

## Core files (your application)

```
docs/architecture/
├── context/always-on.md   ← session context (every chat)
├── blueprint.md           ← construction plan + progress + WRK + session log
├── entry-point.md         ← human entry, navigation, source links
├── interfaces/            ← exports.md, imports.md
├── work/                  ← architecture work + review reports
└── arc42/                 ← or c4-light/, adr-first/, lean-service/
```

Templates: [docs/templates/architecture/](./docs/templates/architecture/). Core agent rules: [prompts/core/system-prompt.md](./prompts/core/system-prompt.md).

---

## In one sentence

Agents excel at single files but fail on cross-cutting architecture; this pattern **compiles** knowledge into a repo graph, **builds** it phase by phase, **evolves** it with maintenance, and **works** from it for architecture tasks.

---

## License

[MIT](./LICENSE) · [Contributions](./CONTRIBUTING.md)
