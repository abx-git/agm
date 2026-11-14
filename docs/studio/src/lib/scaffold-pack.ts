import type { ProjectParams } from '../types'

function okf(type: string, title: string, body: string): string {
  const ts = new Date().toISOString().slice(0, 10)
  return [
    '---',
    `type: ${type}`,
    `title: "${title.replace(/"/g, '\\"')}"`,
    'description: ""',
    'resource: "repo://"',
    'tags: [tekto]',
    `timestamp: "${ts}"`,
    '---',
    '',
    body.trim(),
    '',
  ].join('\n')
}

/** Tekto minimal starter from Studio Install. */
export function buildStarterScaffold(params: ProjectParams): Record<string, string> {
  const name = params.appName || 'My Application'

  const steer = okf(
    'steer',
    'Steer',
    `# Tekto — steer — ${name}

## Map

- [Index](./index.md)
- [Chapters](./chapters/README.md)
- [Reviews](./reviews/README.md)
- [Rules](./rules/README.md)

## Now

| Owner | Task | Link |
|-------|------|------|
| — | First context capture (\`understand\`) | [chapters/](./chapters/) |
`
  )

  const log = okf(
    'log',
    'Change log',
    `# log

Format: \`YYYY-MM-DD | type | path | note\`

${new Date().toISOString().slice(0, 10)} | init | steer.md | Tekto Studio install
`
  )

  const index = okf('index', 'Tekto index', '# Index\n')
  const chapters = okf('index', 'Chapters', '# Chapters\n')
  const reviews = okf('index', 'Reviews', '# Reviews\n')
  const rules = okf('index', 'Rules', '# Rules\n')

  return {
    'steer.md': steer,
    'log.md': log,
    'index.md': index,
    'chapters/README.md': chapters,
    'reviews/README.md': reviews,
    'rules/README.md': rules,
  }
}