package report

import (
	"encoding/json"
	"fmt"
	"strings"
)

// FullReport is the machine-readable validation envelope.
type FullReport struct {
	Status       string   `json:"status"`
	Version      string   `json:"version"`
	Repo         string   `json:"repo"`
	DurationMs   int64    `json:"durationMs"`
	ChangedFiles int      `json:"changedFiles"`
	Checks       []Result `json:"checks"`
}

// FormatJSON serializes a full report.
func FormatJSON(r FullReport) ([]byte, error) {
	return json.MarshalIndent(r, "", "  ")
}

// FormatAll renders human-readable output for multiple check results.
func FormatAll(checks []Result) string {
	var b strings.Builder
	errors := 0
	for _, r := range checks {
		b.WriteString(Format(r))
		for _, v := range r.Violations {
			if v.Severity == SeverityError {
				errors++
			}
		}
	}
	if errors == 0 && len(checks) > 0 {
		b.WriteString(fmt.Sprintf("\n✓ agm-validator: pass (%d check(s))\n", len(checks)))
	} else if errors > 0 {
		b.WriteString(fmt.Sprintf("\n✗ agm-validator: %d error(s)\n", errors))
	}
	return b.String()
}
