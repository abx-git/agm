package report

import (
	"fmt"
	"strings"
)

// Severity classifies a validation finding.
type Severity string

const (
	SeverityError   Severity = "error"
	SeverityWarning Severity = "warning"
)

// Violation is a single architecture rule breach.
type Violation struct {
	Check    string   `json:"check"`
	Severity Severity `json:"severity"`
	Code     string   `json:"code"`
	Message  string   `json:"message"`
	File     string   `json:"file,omitempty"`
	Contract string   `json:"contract,omitempty"`
}

// Result groups violations for one check pass.
type Result struct {
	Check      string      `json:"check"`
	Violations []Violation `json:"violations"`
	Status     string      `json:"status,omitempty"`
}

// Format renders human-readable terminal output.
func Format(r Result) string {
	var b strings.Builder

	if len(r.Violations) == 0 {
		b.WriteString(fmt.Sprintf("✓ %s: pass\n", r.Check))
		return b.String()
	}

	b.WriteString(fmt.Sprintf("✗ %s: %d violation(s)\n\n", r.Check, len(r.Violations)))
	for i, v := range r.Violations {
		tag := strings.ToUpper(string(v.Severity))
		b.WriteString(fmt.Sprintf("%d. [%s] %s\n", i+1, tag, v.Message))
		if v.File != "" {
			b.WriteString(fmt.Sprintf("   file: %s\n", v.File))
		}
		if v.Contract != "" {
			b.WriteString(fmt.Sprintf("   contract: %s\n", v.Contract))
		}
		if v.Code != "" {
			b.WriteString(fmt.Sprintf("   code: %s\n", v.Code))
		}
		b.WriteString("\n")
	}
	return b.String()
}
