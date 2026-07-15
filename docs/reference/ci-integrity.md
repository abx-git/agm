# Referential integrity — CI enforcement

The agent performs referential integrity checks during every session. For mechanical enforcement independent of the agent, add a Markdown link checker to your CI pipeline.

This repository includes [`.github/workflows/agm-integrity.yml`](../../.github/workflows/agm-integrity.yml), [`.mlc-config.json`](../../.mlc-config.json), and [`scripts/check-doc-links.py`](../../scripts/check-doc-links.py) (per-file `markdown-link-check` with filesystem fallback for Linux false positives on non-`.md` paths).

Local check: `python3 scripts/check-doc-links.py`

Broken backlinks are caught at pull request level, not only when an agent session runs.
