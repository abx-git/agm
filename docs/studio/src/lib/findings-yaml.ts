export interface TektoFinding {
  id: string
  aspect: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  claim: string
  evidence: string[]
  rule?: string
  confidence?: 'low' | 'medium' | 'high'
  status: 'open' | 'addressed' | 'wontfix'
}

function parseScalarBlock(block: string, key: string): string | undefined {
  const m = block.match(new RegExp(`^\\s*${key}:\\s*(.+)$`, 'm'))
  return m?.[1]?.trim().replace(/^["']|["']$/g, '')
}

function parseEvidence(block: string): string[] {
  const m = block.match(/evidence:\s*\n((?:\s+-\s+.+\n?)+)/)
  if (!m) return []
  const out: string[] = []
  for (const line of m[1]!.split('\n')) {
    const item = line.match(/^\s*-\s+(.+)$/)
    if (item) out.push(item[1]!.trim())
  }
  return out
}

export function parseFindingsYaml(content: string): TektoFinding[] {
  const findings: TektoFinding[] = []
  const blocks = content.split(/^\s*-\s+id:/m).slice(1)
  for (const raw of blocks) {
    const block = `id:${raw}`
    const id = parseScalarBlock(block, 'id')
    if (!id) continue
    const aspect = parseScalarBlock(block, 'aspect') || 'context'
    const severity = (parseScalarBlock(block, 'severity') || 'medium') as TektoFinding['severity']
    const claim = parseScalarBlock(block, 'claim') || ''
    const evidence = parseEvidence(block)
    const rule = parseScalarBlock(block, 'rule')
    const confidence = parseScalarBlock(block, 'confidence') as TektoFinding['confidence'] | undefined
    const status = (parseScalarBlock(block, 'status') || 'open') as TektoFinding['status']
    findings.push({
      id,
      aspect,
      severity,
      claim,
      evidence,
      rule,
      confidence,
      status,
    })
  }
  return findings
}

function yamlQuote(s: string): string {
  if (/[:#\n"]/.test(s)) return `"${s.replace(/"/g, '\\"')}"`
  return s
}

export function serializeFindingsYaml(findings: TektoFinding[]): string {
  const lines: string[] = []
  for (const f of findings) {
    lines.push(`- id: ${f.id}`)
    lines.push(`  aspect: ${f.aspect}`)
    lines.push(`  severity: ${f.severity}`)
    lines.push(`  claim: ${yamlQuote(f.claim)}`)
    lines.push(`  evidence:`)
    for (const e of f.evidence.length ? f.evidence : ['README.md']) {
      lines.push(`    - ${e}`)
    }
    if (f.rule) lines.push(`  rule: ${f.rule}`)
    lines.push(`  confidence: ${f.confidence || 'medium'}`)
    lines.push(`  status: ${f.status}`)
    lines.push('')
  }
  return lines.join('\n').trim() + '\n'
}

export function newFindingId(existing: TektoFinding[]): string {
  let max = 0
  for (const f of existing) {
    const m = f.id.match(/^F-(\d+)$/i) || f.id.match(/(\d+)$/)
    if (m) max = Math.max(max, parseInt(m[1]!, 10))
  }
  return `F-${String(max + 1).padStart(3, '0')}`
}