package main

import (
	"fmt"
	"os"

	"github.com/abx-git/blueprint-pattern/agm-validator/internal/cli"
)

func main() {
	if err := cli.Run(os.Args[1:]); err != nil {
		fmt.Fprintf(os.Stderr, "agm-validator: %v\n", err)
		os.Exit(1)
	}
}
