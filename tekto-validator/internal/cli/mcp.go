package cli

import (
	"github.com/abx-git/agm/agm-validator/internal/mcp"
)

func runMCP(args []string) error {
	if len(args) > 0 {
		return mcp.Serve(Version, args)
	}
	return mcp.Serve(Version, nil)
}
