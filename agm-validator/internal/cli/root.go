package cli

import (
	"fmt"
	"os"
	"strings"
)

// Version is set at link time: go build -ldflags "-X github.com/.../internal/cli.Version=1.0.0"
var Version = "0.1.0-dev"

const usage = `agm-validator — deterministic AGM architecture enforcement

Usage:
  agm-validator validate [flags]   run checks against git diff (default)
  agm-validator mcp                  start MCP server (stdio)
  agm-validator version              print version

Validate flags:
  --repo PATH     git repository root (default: .)
  --staged        inspect staged changes only (pre-commit)
  --base REF      git ref to diff against (default: HEAD)
  --arch PATH     architecture docs root (default: docs/architecture)
  --check NAME    contract | trace | graph (repeatable, default: contract)
  --json          JSON output
  --quiet         only print on violations (text mode)

Examples:
  agm-validator validate --staged
  agm-validator validate --repo . --check contract --json
  agm-validator mcp
`

// Run dispatches subcommands.
func Run(args []string) error {
	if len(args) == 0 {
		args = []string{"validate"}
	}

	switch args[0] {
	case "validate", "check":
		return runValidate(args[1:])
	case "mcp", "serve":
		return runMCP(args[1:])
	case "version", "-v", "--version":
		fmt.Println(Version)
		return nil
	case "help", "-h", "--help":
		fmt.Fprint(os.Stdout, usage)
		return nil
	default:
		if strings.HasPrefix(args[0], "-") {
			return runValidate(args)
		}
		return fmt.Errorf("unknown command %q\n\n%s", args[0], usage)
	}
}
