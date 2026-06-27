---
type: architecture-domain-events
title: "Domain events"
description: "Catalog of domain and integration events"
resource: "repo://"
tags: [domain, events, ddd]
timestamp: ""
---

# Domain events

<!-- Catalog of domain and integration events. Sync with interfaces/exports and publishers in code. -->

| ID | Name | Context | Type | Payload summary | Consumers | Source |
|----|------|---------|------|-----------------|-----------|--------|
| — | — | — | domain \| integration | — | — | — |

**Type**

- **domain:** internal to a bounded context; may not leave the context boundary
- **integration:** published contract for other contexts (link [exports.md](../interfaces/exports.md))

Topic / channel naming: <!-- e.g. orders.created — record convention in arc42/concepts or here -->
