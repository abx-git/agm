# Blueprint Pattern für Architekten

Kurzfassung des [vollständigen Artikels (EN)](./../blueprint-pattern-for-architects.md).

---

## Das Problem

AI-Coding-Agenten sind stark in einzelnen Dateien, schwach bei Architekturfragen. *„Wie hängt Payment mit Notification zusammen?"* führt zu Halluzinationen oder vollem Context-Window durch Quellcode-Scan.

Bestehende Ansätze (RAG, GraphRAG, Confluence, MkDocs) lösen jeweils nur Teile — keiner liefert einen **traversierbaren, aktuellen, infrastrukturfreien Graphen** neben dem Code.

---

## Die Lösung

Das Blueprint Pattern ist ein **Dokumentationsmuster**, kein Produkt: ein Markdown-Link-Graph in `docs/architecture/`, gepflegt von AI-Agenten, versioniert in Git — oft strukturiert nach **arc42** und **C4** (empfohlen, aber nicht Pflicht; gute Basis für strukturierte Architekturdokumentation).

**Kernidee:** Architekturwissen einmal **kompilieren**, dann deterministisch **traversieren** — nicht per Embedding-Suche zur Laufzeit abrufen.

---

## Operationen

| Operation | Wann | Ergebnis |
|-----------|------|----------|
| **Bootstrap** | Einmalig, kein Blueprint | Blueprint + arc42-Abschnitte |
| **Review** | Eigene Session nach Bootstrap | Prüfbericht in `work/`, keine Fixes |
| **Refinement** | Laufend (bei großen Systemen Pflicht) | Vertiefung einzelner Abschnitte |
| **Maintenance** | Bei `git diff` | Nur betroffene Dateien aktualisieren |
| **Architecture Work** | Nach Bootstrap | Fragen, Analysen, Designs → `work/` |

Erweiterungen (Base Context, Rollen, Compaction, Ops): [Extensions (EN)](../blueprint-pattern-extensions.md).

---

## Architecture Work (neu)

Nach dem Bootstrap nutzt ihr den Graphen für:

| Modus | Zweck | Ablage |
|-------|-------|--------|
| **Query** | Architekturfrage beantworten | `work/YYYY-MM-DD-<slug>.md` (type: question) |
| **Analysis** | Risiken, Kopplung, Qualität analysieren | type: analysis |
| **Design** | Zielarchitektur vorschlagen | type: design (+ optional ADR) |

- **Registry:** `blueprint.md` § Architecture work (IDs `WRK-001`, …)
- **Template:** `work/_template.md`
- **Anleitung:** [Architecture Work Guide](../../architecture-work-guide.md)
- **Workflows:** [prompts/README.md](../../prompts/README.md) (git checkout pro Operation)
- **Beispiele:** [Sample work/](../examples/sample-app/order-service/docs/architecture/work/)

**Regeln:** Nur über Links traversieren · nichts aus arc42 duplizieren · Traceability-Tabelle pflegen · Designs mit Entscheidungsbedarf → ADR-Entwurf.

---

## Sieben Prinzipien

1. **Deterministische Navigation** — nur explizite Links
2. **Documentation as Code** — Architektur im Repo, im PR-Workflow
3. **Vier Operationen** — siehe oben
4. **Blueprint** — session-übergreifender Fortschritt in `blueprint.md`
5. **Interface Contracts** — `exports.md` / `imports.md`
6. **Guardrails** — Patterns, Smells, SOLID sichtbar machen
7. **Referentielle Integrität** — kaputte Links melden, CI erzwingen

---

## Einstieg

1. **[Kurzanleitung](../anleitung.md)** — Übersicht und täglicher Ablauf (zuerst lesen)
2. [Beispiel-Anwendung](../examples/sample-app/) ansehen
3. Kernprompt + Workflow `bootstrap-init` (siehe Anleitung)
4. Architecture Work bei Bedarf (`architecture-work-*` Workflows)

---

## Grenzen & Praxiserfahrung

- **Große Kernsysteme:** Das Verfahren wurde auf sehr große, elementare Unternehmenssysteme angewendet — zuverlässig im Einsatz
- **Kontinuierliches Refinement:** Entscheidend ist nicht ein perfekter Bootstrap, sondern **laufende Vertiefung** (Daueraufgabe, nicht optional)
- Mittlere Anwendungen (~10k–100k LOC) eignen sich am einfachsten für den Einstieg
- Keine parallelen Agent-Sessions auf einem Blueprint

[Field experience →](../../AUTHORS.md#field-experience)

---

## Autor

**Andreas Bergmann**, Software Architect in Hamburg. Er probiert gerne durchdachte Lösungen aus — auch wenn sie noch nicht fertig sind — sobald sie echtes Potenzial zeigen. [Mehr →](../../AUTHORS.md)

---

[Vollständiger Artikel auf Englisch →](./../blueprint-pattern-for-architects.md)
