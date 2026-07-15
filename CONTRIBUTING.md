# Contributing to the Architecture Graph Method (AGM)

Thank you for your interest in the Architecture Graph Method (AGM). This repository documents a method, not a product — contributions that sharpen AGM or prove it in practice are especially welcome.

## Ways to contribute

### Case studies

The most valuable contribution is a real-world application of the Architecture Graph Method (AGM) in your repository. Open an issue using the **Case Study** template and include:

- Repository link (public or anonymized excerpt)
- Application size (LOC, number of services)
- What worked, what did not
- Bootstrap duration and maintenance overhead

### Pattern refinements

Improvements to the system prompt, Blueprint format, or CI templates belong in pull requests against this repository. Keep changes focused — one concern per PR.

### Documentation

Prioritize [docs/quickstart.md](docs/quickstart.md) clarity and [docs/ROADMAP.md](docs/ROADMAP.md) items over new workflow variants. Fix typos, clarify explanations, or add translations. Long-form article: `docs/article/`.

## Pull request guidelines

1. Describe the motivation, not just the diff.
2. Keep Markdown link paths relative and resolvable.
3. Run the link checker locally if you change files under `docs/architecture/`:

   ```bash
   npx markdown-link-check docs/architecture/**/*.md
   ```

## Code of conduct

Be respectful and constructive. Architecture discussions benefit from disagreement — not from personal attacks.

## Questions

Open a [GitHub Discussion](https://github.com/abx-git/agm/discussions) or an issue labeled `question`.
