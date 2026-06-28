# Referential integrity — CI enforcement

The agent performs referential integrity checks during every session. For mechanical enforcement independent of the agent, add a Markdown link checker to your CI pipeline.

This repository includes [`.github/workflows/blueprint-pattern-integrity.yml`](../../.github/workflows/blueprint-pattern-integrity.yml) and [`.mlc-config.json`](../../.mlc-config.json).

Broken backlinks are caught at pull request level, not only when an agent session runs.
