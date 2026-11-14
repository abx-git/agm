import type { FileMap } from './fs-access'
import type { ReviewInfo } from './spikes'

/** Tekto reviews: reviews/<id>/findings.yaml (no index.md required). */
export function listTektoReviews(files: FileMap): ReviewInfo[] {
  const dirs = new Set<string>()
  for (const p of files.keys()) {
    const m = p.match(/(^|\/)reviews\/([^/]+)\/(findings\.yaml|threads\.yaml|report\.md)$/)
    if (m) {
      const prefix = m[1] ? m[1].replace(/\/$/, '') : ''
      dirs.add(prefix ? `${prefix}/reviews/${m[2]}` : `reviews/${m[2]}`)
    }
  }
  const reviews: ReviewInfo[] = []
  for (const dir of dirs) {
    if (dir.endsWith('/README') || dir.includes('_template')) continue
    const slug = dir.split('/').pop() || dir
    reviews.push({
      path: dir,
      id: slug,
      title: slug.replace(/-/g, ' '),
      verdict: files.get(`${dir}/report.md`)?.match(/VERDICT[:\s]+(\w+)/i)?.[1] || '',
      date: slug.match(/(\d{4}-\d{2}-\d{2})/)?.[1] || '',
    })
  }
  return reviews.sort((a, b) => b.date.localeCompare(a.date) || a.path.localeCompare(b.path))
}

export function buildTektoReviewFiles(input: {
  slug: string
  title: string
  date?: string
}): Record<string, string> {
  const date = input.date || new Date().toISOString().slice(0, 10)
  const folder = `reviews/${date}-${input.slug}`
  return {
    [`${folder}/findings.yaml`]: `- id: F-001
  aspect: context
  severity: medium
  claim: "${input.title.replace(/"/g, '\\"')}"
  evidence: []
  confidence: medium
  status: open
`,
    [`${folder}/threads.yaml`]: `threads: []
`,
    [`${folder}/report.md`]: `---
type: review-report
title: "Review — ${input.title.replace(/"/g, '\\"')}"
timestamp: "${date}"
---

# Report

## Verdict

pending

## Summary

-
`,
  }
}