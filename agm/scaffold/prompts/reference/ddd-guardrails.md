# DDD guardrails catalog

Reference for Domain Work workflows. Findings may be recorded in `blueprint.md` ## Guardrail findings and linked from `work/` reports.

Severity: **critical** · **major** · **minor**

## Strategic (bounded context & integration)

| ID | Smell | Severity | Evidence to collect |
|----|-------|----------|---------------------|
| DDD-S01 | Shared database across bounded contexts | critical | Schema/table used by multiple services without explicit contract |
| DDD-S02 | Bounded context boundary unclear or overlapping | major | Same concept modelled differently with no context map entry |
| DDD-S03 | Core domain logic treated as generic/commodity | major | Differentiating rules in generic modules or external SaaS without ADR |
| DDD-S04 | Missing integration pattern (ACL/OHS) where models differ | major | Direct type sharing or DTO leak across contexts |
| DDD-S05 | Team–context misalignment (Conway) | major | One team owns multiple unrelated contexts or one context split across teams |
| DDD-S06 | Context map stale vs `interfaces/` | minor | Documented relationship contradicts exports/imports |

## Tactical (model & language)

| ID | Smell | Severity | Evidence to collect |
|----|-------|----------|---------------------|
| DDD-T01 | Anemic domain model | major | Entities/VOs without behaviour; logic only in services/controllers |
| DDD-T02 | Aggregate boundary violated | major | Cross-aggregate invariant enforced in application layer only |
| DDD-T03 | God aggregate | major | Aggregate root with unbounded child graph or unrelated responsibilities |
| DDD-T04 | Repository on non-aggregate | major | Repository interface for entity that is not aggregate root |
| DDD-T05 | Ubiquitous language mismatch | minor | 3+ synonyms for same concept (code vs glossary vs API) |
| DDD-T06 | Technical leak in domain language | minor | Infrastructure terms in domain model names without bounded context reason |
| DDD-T07 | Domain event vs integration event conflated | major | Same payload/event name for internal state change and external contract |
| DDD-T08 | Missing domain event for state change peers care about | minor | State change with no catalog entry in `domain/events.md` |

## Process (discovery & documentation)

| ID | Smell | Severity | Evidence to collect |
|----|-------|----------|---------------------|
| DDD-P01 | Context model doc missing for implemented context | minor | Code module exists; no `domain/contexts/<name>/model.md` |
| DDD-P02 | Event catalog missing published events | minor | `exports.md` or publisher code lists events not in `domain/events.md` |

Source field in blueprint: `Domain Work (WRK-NNN)` · `Guardrail (Phase N)` · `Review (YYYY-MM-DD)`
