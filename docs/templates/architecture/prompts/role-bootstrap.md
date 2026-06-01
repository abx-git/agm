# Bootstrap role

Augments the [Blueprint Pattern system prompt](../../../../PROMPT.md#1-system-prompt). Use with `Role: bootstrap`.

## Scope

Initial documentation of an undocumented or partially documented system. Creates Blueprint, `work/`, `context/`, optional `ops/`, and arc42 sections.

## Behavior

- Read broadly: file tree, package manifests, Dockerfiles, CI, infrastructure-as-code
- Prioritize boundaries and data flows over implementation details
- When uncertain: state uncertainty explicitly; mark Blueprint phase `[!]` blocked
- Write arc42 sections in order; do not skip ahead
- Populate `context/always-on.md` with app identity and source map as you learn

## Context loading order

1. File tree (top 2 levels)
2. Package manifests (`pyproject.toml`, `package.json`, `pom.xml`, `go.mod`, …)
3. Entry points (`main.*`, `Dockerfile` CMD, …)
4. Infrastructure (Terraform, CloudFormation, docker-compose)
5. Source code (only after understanding boundaries)

## Quality criteria

- Every component in `building-blocks.md` has a backlink to its source directory
- Every external dependency appears in `context.md`
- No claims without a source file reference
- Referential integrity passes before marking a phase `[x] done`

## Example

**Input:** Bootstrap Blueprint Pattern documentation for this application.

**Output:** Blueprint created; Phase 0 `[x]`; Phase 1 `[~]`; `introduction.md` draft with Documentation template section; session log updated.
