package cli

import (
	"flag"
	"fmt"
	"os"

	"github.com/abx-git/blueprint-pattern/agm-validator/internal/report"
	"github.com/abx-git/blueprint-pattern/agm-validator/internal/validate"
)

func runValidate(args []string) error {
	fs := flag.NewFlagSet("validate", flag.ContinueOnError)
	fs.SetOutput(os.Stderr)

	repo := fs.String("repo", ".", "path to git repository root")
	staged := fs.Bool("staged", false, "inspect staged changes (pre-commit hook)")
	base := fs.String("base", "HEAD", "git ref to diff against")
	archRoot := fs.String("arch", validate.DefaultArchRoot, "architecture docs root relative to repo")
	jsonOut := fs.Bool("json", false, "emit JSON report")
	quiet := fs.Bool("quiet", false, "only print violations (text mode)")
	var checks multiFlag
	fs.Var(&checks, "check", "check to run: contract, trace, graph (repeatable)")

	if err := fs.Parse(args); err != nil {
		return err
	}

	result, err := validate.Run(validate.Options{
		Repo:     *repo,
		Staged:   *staged,
		Base:     *base,
		ArchRoot: *archRoot,
		Checks:   checks,
	})
	if err != nil {
		return err
	}
	result.Version = Version

	if *jsonOut {
		payload := report.FullReport{
			Status:       result.Status,
			Version:      result.Version,
			Repo:         result.Repo,
			DurationMs:   result.DurationMs,
			ChangedFiles: result.ChangedFiles,
			Checks:       result.Checks,
		}
		b, err := report.FormatJSON(payload)
		if err != nil {
			return err
		}
		fmt.Println(string(b))
	} else if !*quiet || result.ErrorCount() > 0 {
		fmt.Print(report.FormatAll(result.Checks))
	}

	if result.ErrorCount() > 0 {
		return fmt.Errorf("%d architecture violation(s)", result.ErrorCount())
	}
	return nil
}

type multiFlag []string

func (m *multiFlag) String() string { return "" }

func (m *multiFlag) Set(v string) error {
	*m = append(*m, v)
	return nil
}
