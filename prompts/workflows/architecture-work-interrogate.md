# Workflow: architecture-work-interrogate

| Field | Value |
|-------|-------|
| **When** | Dialog zum Herantasten an eine Lösung (eine Frage pro Antwort) |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `entry-point.md` existiert |
| **Fresh session** | Recommended — Cursor **Chat** (nicht Agent/Composer) |

## Session prompt

```
Blueprint Pattern — Architecture Work (interrogate / Dialog-Modus).
Workflow: architecture-work-interrogate
Role: architecture-work

Ziel / Fragestellung: <your question here>

═══════════════════════════════════════════════════════
PHASE 1 — INTERVIEW (aktiv bis explizites Ende)
═══════════════════════════════════════════════════════

Dieser Workflow ist ein **Dialog zum Herantasten an die Lösung**.
Er hat VORRANG vor role-architecture-work.md (Schritte 3–5 und OUTPUT_CONTRACT) bis Phase 2 beginnt.

VERBOTEN in Phase 1 — bei jeder Antwort bis der Mensch „Interview beenden" schreibt oder alle Plan-Punkte geklärt sind:
- Keine Dateien erstellen, ändern oder vorschlagen zu erstellen
- Keine Mermaid-Diagramme, Architektur-Skizzen oder Design-Vorschläge
- Keine Empfehlungslisten, Trade-offs oder Lösungsentwürfe
- Keine [[ANCHOR:...]] Ausgabe
- Nicht mehr als EINE Frage pro Antwort

ERLAUBT in Phase 1:
- In der ERSTEN Antwort: kurzer Befragungsplan (3–5 Bullets) + genau Frage 1
- In Folge-Antworten: optional max. 2 Sätze Kontext/Fortschritt + genau EINE Frage
- Plan anpassen wenn der Mensch frühere Antworten revidiert

Antwortformat Phase 1 (strikt einhalten):
---
**Fortschritt:** Punkt X von Y — [Thema]
**Kurz:** [optional, max. 2 Sätze]
**Frage:** [genau eine Frage]
---

═══════════════════════════════════════════════════════
PHASE 2 — FESTSCHREIBEN (nur nach explizitem Signal)
═══════════════════════════════════════════════════════

Starte Phase 2 erst wenn:
- der Mensch „Interview beenden", „fertig" oder „Festschreiben" schreibt, ODER
- alle Punkte des Befragungsplans geklärt sind und der Mensch zustimmt.

Dann erst: role-architecture-work.md anwenden, Datei unter <doc-root>work/YYYY-MM-DD-<slug>.md schreiben (type: design), WRK-Eintrag in <doc-root>blueprint.md, [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] ausgeben.

Vorgehen Phase 1:
1. Lies <doc-root>blueprint.md und traverse ab <doc-root>entry-point.md (still im Hintergrund — nicht als Wall of Text ausgeben).
2. Erste Antwort: kurzes Verständnis (1 Satz) + Befragungsplan (3–5 Bullets) + Frage 1.
3. Jede weitere Antwort: Fortschritt + optional Kurz + genau eine Frage. Warte immer auf den Menschen.
4. Bei Revision: Plan anpassen, betroffene Punkte erneut klären.

Bestätige in deiner ERSTEN Antwort den Dialog-Modus, zeige den Plan und stelle Frage 1. Erfinde keine Lösung vorab.
```
