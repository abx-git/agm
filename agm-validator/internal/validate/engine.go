package validate

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/abx-git/agm/agm-validator/internal/contract"
	"github.com/abx-git/agm/agm-validator/internal/git"
	"github.com/abx-git/agm/agm-validator/internal/report"
)

const DefaultArchRoot = "docs/architecture"

// Options configures a validation run.
type Options struct {
	Repo     string
	Staged   bool
	Base     string
	ArchRoot string
	Checks   []string // contract (default), trace, graph — trace/graph planned
}

// Report is the full validation output shared by CLI and MCP.
type Report struct {
	Status      string          `json:"status"` // pass | fail
	Version     string          `json:"version"`
	Repo        string          `json:"repo"`
	DurationMs  int64           `json:"durationMs"`
	ChangedFiles int            `json:"changedFiles"`
	Checks      []report.Result `json:"checks"`
}

// Run executes all requested checks against the git diff.
func Run(opts Options) (*Report, error) {
	start := time.Now()

	if opts.ArchRoot == "" {
		opts.ArchRoot = DefaultArchRoot
	}
	if len(opts.Checks) == 0 {
		opts.Checks = []string{"contract"}
	}

	repoAbs, err := filepath.Abs(opts.Repo)
	if err != nil {
		return nil, fmt.Errorf("resolve repo path: %w", err)
	}

	if _, err := git.RepoRoot(repoAbs); err != nil {
		return nil, err
	}

	diff, err := git.LoadDiff(repoAbs, git.DiffOptions{
		Staged: opts.Staged,
		Base:   opts.Base,
	})
	if err != nil {
		return nil, err
	}

	var results []report.Result

	for _, check := range opts.Checks {
		switch check {
		case "contract":
			r, err := runContract(repoAbs, opts.ArchRoot, diff)
			if err != nil {
				return nil, err
			}
			results = append(results, r)
		case "trace":
			v := []report.Violation{{
				Check:    "traceability",
				Severity: report.SeverityWarning,
				Code:     "NOT_IMPLEMENTED",
				Message:  "traceability check (WRK recommendations) is not yet available in this build",
			}}
			results = append(results, report.Result{
				Check:      "traceability",
				Status:     checkStatus(v),
				Violations: v,
			})
		case "graph":
			v := []report.Violation{{
				Check:    "graph-sync",
				Severity: report.SeverityWarning,
				Code:     "NOT_IMPLEMENTED",
				Message:  "graph sync check (index.md, log.md, links) is not yet available in this build",
			}}
			results = append(results, report.Result{
				Check:      "graph-sync",
				Status:     checkStatus(v),
				Violations: v,
			})
		default:
			return nil, fmt.Errorf("unknown check %q (supported: contract, trace, graph)", check)
		}
	}

	status := "pass"
	for _, r := range results {
		for _, v := range r.Violations {
			if v.Severity == report.SeverityError {
				status = "fail"
				break
			}
		}
		if status == "fail" {
			break
		}
	}

	return &Report{
		Status:       status,
		Repo:         repoAbs,
		DurationMs:   time.Since(start).Milliseconds(),
		ChangedFiles: len(diff.ChangedPaths()),
		Checks:       results,
	}, nil
}

func runContract(repoAbs, archRoot string, diff *git.Diff) (report.Result, error) {
	exportsPath := filepath.Join(repoAbs, archRoot, "interfaces", "exports.md")
	importsPath := filepath.Join(repoAbs, archRoot, "interfaces", "imports.md")

	var violations []report.Violation

	exports, err := contract.ParseExportsFile(exportsPath)
	if err != nil {
		if os.IsNotExist(err) {
			return report.Result{Check: "contract-compliance"}, nil
		}
		return report.Result{}, fmt.Errorf("parse exports: %w", err)
	}

	violations = append(violations, contract.CheckCompliance(exports, importsPath, diff, repoAbs)...)

	return report.Result{
		Check:      "contract-compliance",
		Status:     checkStatus(violations),
		Violations: violations,
	}, nil
}

func checkStatus(violations []report.Violation) string {
	for _, v := range violations {
		if v.Severity == report.SeverityError {
			return "fail"
		}
	}
	return "pass"
}

// ErrorCount returns blocking errors across all checks.
func (r *Report) ErrorCount() int {
	n := 0
	for _, c := range r.Checks {
		for _, v := range c.Violations {
			if v.Severity == report.SeverityError {
				n++
			}
		}
	}
	return n
}
