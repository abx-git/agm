package contract

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"

	"github.com/abx-git/blueprint-pattern/agm-validator/internal/git"
	"github.com/abx-git/blueprint-pattern/agm-validator/internal/report"
)

// Contract describes one exported interface entry from exports.md.
type Contract struct {
	ID          string
	Name        string
	Type        string // api, event, service, unknown
	SourcePath  string // repo-relative normalized path
	SourceLabel string
	Methods     []string // e.g. POST /orders
	Symbols     []string // function/type names referenced in the contract body
}

// ExportsDoc is the parsed contract surface of exports.md.
type ExportsDoc struct {
	Path      string
	Contracts []Contract
	bySource  map[string][]Contract
}

var (
	sectionHeaderRE = regexp.MustCompile(`^##\s+([A-Z]+-[A-Z]+-\d+):\s*(.+)$`)
	sourceLineRE    = regexp.MustCompile(`^\s*-\s*\*\*Source:\*\*\s*\[([^\]]*)\]\(([^)]+)\)`)
	methodLineRE    = regexp.MustCompile(`^\s*-\s*\*\*Method:\*\*\s*` + "`" + `([^` + "`" + `]+)` + "`")
	schemaLineRE    = regexp.MustCompile(`^\s*-\s*\*\*Schema:\*\*\s*` + "`" + `?([^` + "`" + `\n]+)` + "`"?")
	backtickSymRE   = regexp.MustCompile("`([A-Za-z_][A-Za-z0-9_]*)`")
	tableRowRE      = regexp.MustCompile(`^\|\s*([A-Z]+-[A-Z]+-\d+)\s*\|`)
	tableLinkRE     = regexp.MustCompile(`\[([^\]]*)\]\(([^)]+)\)`)

	exportedSymbolRE = []*regexp.Regexp{
		regexp.MustCompile(`^\+\s*export\s+(?:async\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)`),
		regexp.MustCompile(`^\+\s*export\s+(?:interface|type|class)\s+([A-Za-z_][A-Za-z0-9_]*)`),
		regexp.MustCompile(`^-\s*export\s+(?:async\s+)?function\s+([A-Za-z_][A-Za-z0-9_]*)`),
		regexp.MustCompile(`^-\s*export\s+(?:interface|type|class)\s+([A-Za-z_][A-Za-z0-9_]*)`),
		regexp.MustCompile(`^\+\s*func\s+([A-Z][A-Za-z0-9_]*)\s*\(`),
		regexp.MustCompile(`^-\s*func\s+([A-Z][A-Za-z0-9_]*)\s*\(`),
		regexp.MustCompile(`^\+\s*pub\s+(?:async\s+)?fn\s+([A-Za-z_][A-Za-z0-9_]*)`),
		regexp.MustCompile(`^-\s*pub\s+(?:async\s+)?fn\s+([A-Za-z_][A-Za-z0-9_]*)`),
	}

	routeChangeRE = regexp.MustCompile(`(?:Method:|router\.|HandleFunc|@(GET|POST|PUT|PATCH|DELETE))\s*` + "`?" + `?\s*(GET|POST|PUT|PATCH|DELETE)?\s*([/\w{}.-]+)` + "`?")
)

// ParseExportsFile reads and parses docs/architecture/interfaces/exports.md.
func ParseExportsFile(path string) (*ExportsDoc, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	doc := &ExportsDoc{
		Path:     path,
		bySource: make(map[string][]Contract),
	}

	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024)

	var (
		inFrontmatter bool
		frontDone     bool
		current       *Contract
		inTable       bool
	)

	flush := func() {
		if current == nil || current.ID == "" {
			return
		}
		doc.Contracts = append(doc.Contracts, *current)
		if current.SourcePath != "" {
			doc.bySource[current.SourcePath] = append(doc.bySource[current.SourcePath], *current)
		}
		current = nil
	}

	for scanner.Scan() {
		line := scanner.Text()

		if !frontDone {
			if line == "---" {
				if inFrontmatter {
					frontDone = true
				} else {
					inFrontmatter = true
				}
				continue
			}
			if !inFrontmatter {
				frontDone = true
			} else {
				continue
			}
		}

		if m := sectionHeaderRE.FindStringSubmatch(line); m != nil {
			flush()
			current = &Contract{
				ID:   m[1],
				Name: strings.TrimSpace(m[2]),
				Type: inferType(m[1]),
			}
			inTable = false
			continue
		}

		if strings.Contains(line, "| ID |") && strings.Contains(line, "Source") {
			inTable = true
			continue
		}
		if inTable {
			if !strings.HasPrefix(strings.TrimSpace(line), "|") {
				inTable = false
				continue
			}
			if strings.Contains(line, "---") {
				continue
			}
			if m := tableRowRE.FindStringSubmatch(line); m != nil {
				flush()
				c := Contract{ID: m[1], Type: inferType(m[1])}
				cells := splitTableRow(line)
				if len(cells) > 1 {
					c.Name = strings.TrimSpace(cells[1])
				}
				if len(cells) > 2 {
					c.Type = strings.ToLower(strings.TrimSpace(cells[2]))
				}
				if len(cells) > 3 {
					if link := tableLinkRE.FindStringSubmatch(cells[3]); link != nil {
						c.SourceLabel = link[1]
						c.SourcePath = normalizeSourcePath(link[2])
					}
				}
				doc.Contracts = append(doc.Contracts, c)
				if c.SourcePath != "" {
					doc.bySource[c.SourcePath] = append(doc.bySource[c.SourcePath], c)
				}
			}
			continue
		}

		if current == nil {
			continue
		}

		if m := sourceLineRE.FindStringSubmatch(line); m != nil {
			current.SourceLabel = m[1]
			current.SourcePath = normalizeSourcePath(m[2])
			continue
		}
		if m := methodLineRE.FindStringSubmatch(line); m != nil {
			current.Methods = append(current.Methods, strings.TrimSpace(m[1]))
			continue
		}
		if m := schemaLineRE.FindStringSubmatch(line); m != nil {
			current.Symbols = appendUnique(current.Symbols, extractSchemaSymbol(m[1]))
			continue
		}

		for _, sym := range backtickSymRE.FindAllStringSubmatch(line, -1) {
			current.Symbols = appendUnique(current.Symbols, sym[1])
		}
	}

	flush()

	if err := scanner.Err(); err != nil {
		return nil, fmt.Errorf("scan exports: %w", err)
	}

	return doc, nil
}

// ResolvedBySource maps repo-relative source paths to contracts.
func (d *ExportsDoc) ResolvedBySource(repoRoot string) map[string][]Contract {
	out := make(map[string][]Contract)
	for _, c := range d.Contracts {
		if c.SourcePath == "" {
			continue
		}
		resolved := resolveSourcePath(repoRoot, d.Path, c.SourcePath)
		if resolved == "" {
			continue
		}
		out[resolved] = append(out[resolved], c)
	}
	return out
}

// CheckCompliance compares exports contracts against a git diff.
func CheckCompliance(doc *ExportsDoc, importsPath string, diff *git.Diff, repoRoot string) []report.Violation {
	var out []report.Violation

	exportsRel := repoRelative(repoRoot, doc.Path)
	contractTouched := diff.HasChange(exportsRel)
	importsRel := ""
	if importsPath != "" {
		importsRel = repoRelative(repoRoot, importsPath)
	}
	importsTouched := importsRel != "" && diff.HasChange(importsRel)
	bySource := doc.ResolvedBySource(repoRoot)

	// Rule A: contract source changed -> exports.md must change in same diff.
	for resolved, contracts := range bySource {
		if !diff.HasChange(resolved) {
			continue
		}
		if contractTouched || importsTouched {
			continue
		}

		ids := contractIDs(contracts)
		out = append(out, report.Violation{
			Check:    "contract-compliance",
			Severity: report.SeverityError,
			Code:     "CONTRACT_SOURCE_WITHOUT_SPEC",
			Message:  fmt.Sprintf("source file changed but neither exports.md nor imports.md updated (contracts: %s)", strings.Join(ids, ", ")),
			File:     resolved,
			Contract: strings.Join(ids, ", "),
		})
	}

	// Rule B: exports.md changed -> detect symbol/route drift in linked sources.
	if contractTouched {
		fd := diff.Files[exportsRel]
		if fd == nil {
			for p, f := range diff.Files {
				if strings.HasSuffix(p, "interfaces/exports.md") {
					fd = f
					exportsRel = p
					break
				}
			}
		}
		if fd != nil {
			out = append(out, checkSpecWithoutSource(doc, diff, repoRoot, fd)...)
			out = append(out, checkContractSymbolDrift(doc, diff, repoRoot)...)
		}
	}

	// Rule C: reverse — exported symbol changed in diff but not mentioned in any contract touch.
	out = append(out, checkOrphanSymbolChanges(doc, diff, repoRoot, contractTouched)...)

	return out
}

func checkSpecWithoutSource(doc *ExportsDoc, diff *git.Diff, repoRoot string, exportsDiff *git.FileDiff) []report.Violation {
	var out []report.Violation

	changedIDs := extractChangedContractIDs(exportsDiff)
	if len(changedIDs) == 0 {
		return nil
	}

	byID := make(map[string]Contract, len(doc.Contracts))
	for _, c := range doc.Contracts {
		byID[c.ID] = c
	}

	for _, id := range changedIDs {
		c, ok := byID[id]
		if !ok || c.SourcePath == "" {
			continue
		}
		resolved := resolveSourcePath(repoRoot, doc.Path, c.SourcePath)
		if resolved == "" {
			continue
		}
		if diff.HasChange(resolved) {
			continue
		}
		out = append(out, report.Violation{
			Check:    "contract-compliance",
			Severity: report.SeverityError,
			Code:     "CONTRACT_SPEC_WITHOUT_SOURCE",
			Message:  fmt.Sprintf("contract %s updated in exports.md but linked source %s has no matching diff", id, resolved),
			File:     repoRelative(repoRoot, doc.Path),
			Contract: id,
		})
	}
	return out
}

func checkContractSymbolDrift(doc *ExportsDoc, diff *git.Diff, repoRoot string) []report.Violation {
	var out []report.Violation

	for resolved, contracts := range doc.ResolvedBySource(repoRoot) {
		fd := diff.Files[resolved]
		if fd == nil {
			continue
		}

		changedSymbols := extractExportedSymbols(fd)
		changedRoutes := extractRouteChanges(fd)

		for _, c := range contracts {
			for _, sym := range changedSymbols {
				if !symbolCovered(sym, c) {
					out = append(out, report.Violation{
						Check:    "contract-compliance",
						Severity: report.SeverityError,
						Code:     "EXPORT_SYMBOL_DRIFT",
						Message:  fmt.Sprintf("exported symbol %q changed in %s but not reflected in contract %s", sym, resolved, c.ID),
						File:     resolved,
						Contract: c.ID,
					})
				}
			}
			for _, route := range changedRoutes {
				if !routeCovered(route, c) {
					out = append(out, report.Violation{
						Check:    "contract-compliance",
						Severity: report.SeverityError,
						Code:     "EXPORT_ROUTE_DRIFT",
						Message:  fmt.Sprintf("route %q changed in %s but not reflected in contract %s", route, resolved, c.ID),
						File:     resolved,
						Contract: c.ID,
					})
				}
			}
		}
	}
	return out
}

func checkOrphanSymbolChanges(doc *ExportsDoc, diff *git.Diff, repoRoot string, contractTouched bool) []report.Violation {
	if contractTouched {
		return nil
	}

	tracked := doc.ResolvedBySource(repoRoot)
	var out []report.Violation
	for path, fd := range diff.Files {
		if fd.IsContract || !isLikelySource(path) {
			continue
		}
		if _, ok := tracked[path]; ok {
			continue
		}

		symbols := extractExportedSymbols(fd)
		if len(symbols) == 0 {
			continue
		}

		out = append(out, report.Violation{
			Check:    "contract-compliance",
			Severity: report.SeverityWarning,
			Code:     "UNTRACKED_EXPORT_CHANGE",
			Message:  fmt.Sprintf("exported symbols changed in untracked source %s (%s) — add to exports.md", path, strings.Join(symbols, ", ")),
			File:     path,
		})
	}
	return out
}

func extractChangedContractIDs(fd *git.FileDiff) []string {
	seen := make(map[string]struct{})
	var ids []string
	lines := append(append([]string{}, fd.Additions...), fd.Deletions...)
	for _, line := range lines {
		if m := sectionHeaderRE.FindStringSubmatch(line); m != nil {
			if _, ok := seen[m[1]]; !ok {
				seen[m[1]] = struct{}{}
				ids = append(ids, m[1])
			}
		}
		if m := tableRowRE.FindStringSubmatch(line); m != nil {
			if _, ok := seen[m[1]]; !ok {
				seen[m[1]] = struct{}{}
				ids = append(ids, m[1])
			}
		}
	}
	return ids
}

func extractExportedSymbols(fd *git.FileDiff) []string {
	seen := make(map[string]struct{})
	var out []string
	for _, line := range append(fd.Additions, fd.Deletions...) {
		for _, re := range exportedSymbolRE {
			if m := re.FindStringSubmatch(line); m != nil {
				if _, ok := seen[m[1]]; !ok {
					seen[m[1]] = struct{}{}
					out = append(out, m[1])
				}
			}
		}
	}
	return out
}

func extractRouteChanges(fd *git.FileDiff) []string {
	seen := make(map[string]struct{})
	var out []string
	for _, line := range append(fd.Additions, fd.Deletions...) {
		if m := routeChangeRE.FindStringSubmatch(line); m != nil {
			route := strings.TrimSpace(strings.Trim(m[2]+" "+m[3], " "))
			if route == "" {
				continue
			}
			if _, ok := seen[route]; !ok {
				seen[route] = struct{}{}
				out = append(out, route)
			}
		}
	}
	return out
}

func symbolCovered(sym string, c Contract) bool {
	lower := strings.ToLower(sym)
	if strings.Contains(strings.ToLower(c.Name), lower) {
		return true
	}
	for _, s := range c.Symbols {
		if strings.EqualFold(s, sym) {
			return true
		}
	}
	// camelCase export often maps to contract name words, e.g. createOrder -> Create Order
	if strings.Contains(strings.ToLower(c.Name), stripExportPrefix(lower)) {
		return true
	}
	return false
}

func routeCovered(route string, c Contract) bool {
	route = strings.TrimSpace(route)
	for _, m := range c.Methods {
		if strings.EqualFold(strings.TrimSpace(m), route) {
			return true
		}
	}
	return false
}

func stripExportPrefix(s string) string {
	for _, prefix := range []string{"create", "update", "delete", "get", "list", "publish", "send"} {
		if strings.HasPrefix(s, prefix) && len(s) > len(prefix) {
			return prefix
		}
	}
	return s
}

func inferType(id string) string {
	parts := strings.Split(id, "-")
	if len(parts) < 2 {
		return "unknown"
	}
	switch parts[0] {
	case "API":
		return "api"
	case "EVT":
		return "event"
	case "SVC":
		return "service"
	default:
		return strings.ToLower(parts[0])
	}
}

func extractSchemaSymbol(schema string) string {
	schema = strings.TrimSpace(schema)
	if idx := strings.Index(schema, " "); idx > 0 {
		return schema[:idx]
	}
	return schema
}

func splitTableRow(line string) []string {
	line = strings.TrimSpace(line)
	line = strings.TrimPrefix(line, "|")
	line = strings.TrimSuffix(line, "|")
	parts := strings.Split(line, "|")
	for i := range parts {
		parts[i] = strings.TrimSpace(parts[i])
	}
	return parts
}

func normalizeSourcePath(raw string) string {
	raw = strings.TrimSpace(raw)
	raw = strings.Split(raw, "#")[0]
	return filepath.ToSlash(filepath.Clean(raw))
}

func resolveSourcePath(repoRoot, exportsPath, sourcePath string) string {
	if sourcePath == "" {
		return ""
	}
	if filepath.IsAbs(sourcePath) {
		return repoRelative(repoRoot, sourcePath)
	}
	abs := filepath.Clean(filepath.Join(filepath.Dir(exportsPath), sourcePath))
	if _, err := os.Stat(abs); err != nil {
		// fallback: treat as repo-relative
		abs = filepath.Join(repoRoot, sourcePath)
	}
	return repoRelative(repoRoot, abs)
}

func repoRelative(repoRoot, absPath string) string {
	rel, err := filepath.Rel(repoRoot, absPath)
	if err != nil {
		return filepath.ToSlash(absPath)
	}
	return filepath.ToSlash(rel)
}

func contractIDs(contracts []Contract) []string {
	ids := make([]string, len(contracts))
	for i, c := range contracts {
		ids[i] = c.ID
	}
	return ids
}

func appendUnique(slice []string, val string) []string {
	for _, s := range slice {
		if strings.EqualFold(s, val) {
			return slice
		}
	}
	return append(slice, val)
}

func isLikelySource(path string) bool {
	ext := filepath.Ext(path)
	switch ext {
	case ".go", ".rs", ".ts", ".tsx", ".js", ".jsx", ".py":
		return true
	default:
		return false
	}
}
