# Workflow: architecture-work-interrogate

| Field | Value |
|-------|-------|
| **When** | Interaktive Lösungsfindung im Dialog (Interrogatory LLM) |
| **Role** | `architecture-work` |
| **Prerequisite** | Bootstrap phase 0 `[x] done`; `entry-point.md` existiert |

## Session prompt

```
Blueprint Pattern — Architecture Work (interrogate).
Workflow: architecture-work-interrogate
Role: architecture-work

Ziel / Fragestellung: <your question here>

Anweisungen für Cursor (Verfahrensregeln für diesen Chat):
1. Lies die Dateien <doc-root>blueprint.md und traverse das System ab <doc-root>entry-point.md, um den aktuellen Architektur-Kontext voll zu erfassen.
2. Gib als deine ALLERERSTE Antwort einen kurzen, strukturierten Befragungsplan (3 bis 5 bullet points) aus. Dieser Plan zeigt die Aspekte, die wir im Dialog nacheinander klären müssen, um eine fundierte Lösung zu erarbeiten.
3. Starte direkt nach der Vorstellung des Plans mit dem Interview.
4. STRIKTE REGEL: Stelle im gesamten Verlauf des Chats IMMER NUR EINE FRAGE AUF EINMAL. Warte die Antwort des Menschen ab, bevor du tiefer bohrst oder zum nächsten Punkt des Plans übergehst.
5. Dynamische Revision: Wenn der Mensch im Dialog signalisiert, dass eine vorherige Entscheidung geändert oder revidiert werden muss (z.B. Wechsel der Technologie oder der Randbedingungen), passe deinen internen Entwurf sofort an und validiere, wie sich dies auf den restlichen Befragungsplan auswirkt.
6. Festschreiben: Sobald alle Punkte des Plans abgearbeitet sind oder der Mensch das Interview explizit beendet, kompiliere das gesamte gesammelte Wissen in ein strukturiertes Dokument unter <doc-root>work/YYYY-MM-DD-<slug>.md (Inhalt: Kontext, getroffene Entscheidungen, Architektur-Skizze/Mermaid, Rückverfolgbarkeit).
7. Registriere dieses neue Dokument mit dem Status `[ ] open` oder `[~]` als nächsten WRK-Eintrag im <doc-root>blueprint.md.

Bestätige kurz dein Verständnis des Ablaufs, zeige den Befragungsplan und stelle anschließend direkt Frage 1.

Output [[ANCHOR:WORK_ITEM]], [[ANCHOR:TRACEABILITY_COVERAGE]], [[ANCHOR:OPEN_QUESTIONS]], [[ANCHOR:LINK_CHECK]] before stop.
```
