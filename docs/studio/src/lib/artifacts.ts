import type { DocNode } from '../types'

export type ArtifactKind = 'documentation' | 'reviews' | 'analyses'

export const ARTIFACT_LABELS: Record<ArtifactKind, string> = {
  documentation: 'Dokumentation',
  reviews: 'Reviews',
  analyses: 'Analysen',
}

export const ARTIFACT_HINTS: Record<ArtifactKind, string> = {
  documentation: 'steer, Kapitel, Regeln — dauerhafte Architekturdocs',
  reviews: 'findings.yaml, threads — für KI und Team in Git',
  analyses: 'work/, chapters/ — Ergebnisse von Architektur-Arbeit',
}

export function artifactKindForPath(path: string): ArtifactKind {
  const p = path.replace(/\\/g, '/').toLowerCase()
  if (/(^|\/)reviews\//.test(p)) return 'reviews'
  if (/(^|\/)work\//.test(p) || /(^|\/)chapters\//.test(p)) return 'analyses'
  return 'documentation'
}

export function filterDocsByArtifact(
  docs: Map<string, DocNode>,
  kind: ArtifactKind
): Map<string, DocNode> {
  const out = new Map<string, DocNode>()
  for (const [path, doc] of docs) {
    if (artifactKindForPath(path) === kind) out.set(path, doc)
  }
  return out
}

export function buildReviewShareText(folderPath: string, projectName: string): string {
  return [
    `## Tekto Review — ${projectName || 'Projekt'}`,
    '',
    `Ordner: \`${folderPath}/\``,
    '',
    '| Datei | Für wen |',
    '|-------|---------|',
    '| findings.yaml | Team + KI (strukturierte Befunde) |',
    '| threads.yaml | Review-Dialog (offen/erledigt) |',
    '| report.md | Menschen (lesbarer Bericht) |',
    '',
    'Liegt in Git — für alle mit Repo-Zugriff sichtbar.',
  ].join('\n')
}