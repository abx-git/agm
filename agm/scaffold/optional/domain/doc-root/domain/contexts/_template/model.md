---
type: architecture-domain-model
title: "Bounded context — [Context name]"
description: "Tactical DDD model for a bounded context"
resource: "repo://"
tags: [domain, model, ddd]
timestamp: ""
---

# Bounded context — <Context name>

<!-- Copy to domain/contexts/<context-slug>/model.md -->

## Scope

One paragraph: what this context is responsible for and what is explicitly **out of scope**.

**Implementation:** <!-- module path, service name, package root -->

Links: [context-map.md](../../context-map.md) · [language.md](./language.md)

## Ubiquitous language (summary)

See [language.md](./language.md) for terms. Canonical aggregate and entity names below.

## Aggregates

| Aggregate | Root entity | Invariants | Consistency boundary |
|-----------|-------------|------------|----------------------|
| — | — | — | — |

## Entities & value objects

| Name | Kind | Description | Source |
|------|------|-------------|--------|
| — | entity \| value object | — | — |

## Domain services

| Service | Responsibility | Source |
|---------|----------------|--------|
| — | — | — |

## Domain events (published)

| Event | When | Payload | Integration? |
|-------|------|---------|--------------|
| — | — | — | yes / no |

Cross-link [events.md](../../events.md).

## Repositories

| Repository | Aggregate | Notes |
|------------|-----------|-------|
| — | — | one repository per aggregate root |

## Open questions

- <!-- unresolved model decisions → work/ or ADR -->
