package git

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

// DiffOptions selects which changes to inspect.
type DiffOptions struct {
	Staged bool
	Base   string
}

// FileDiff holds per-file change metadata extracted from a unified diff.
type FileDiff struct {
	Path       string // repo-relative, forward slashes
	OldPath    string // set when renamed
	Status     string // modified, added, deleted, renamed
	Additions  []string
	Deletions  []string
	Changed    bool
	IsContract bool // exports.md or imports.md under interfaces/
}

// Diff is the parsed output of git diff.
type Diff struct {
	Files map[string]*FileDiff
	Raw   []byte
}

// LoadDiff runs git diff and parses the unified diff output.
func LoadDiff(repo string, opts DiffOptions) (*Diff, error) {
	base := opts.Base
	if base == "" {
		base = "HEAD"
	}

	args := []string{"diff", "--unified=0", "--no-color"}
	if opts.Staged {
		args = append(args, "--cached")
	}
	args = append(args, base)

	cmd := exec.Command("git", args...)
	cmd.Dir = repo

	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr
	if err := cmd.Run(); err != nil {
		return nil, fmt.Errorf("git %s in %s: %s", strings.Join(args, " "), repo, strings.TrimSpace(stderr.String()))
	}

	return ParseUnifiedDiff(stdout.Bytes()), nil
}

// ParseUnifiedDiff parses `git diff --unified=0` output.
func ParseUnifiedDiff(raw []byte) *Diff {
	d := &Diff{
		Files: make(map[string]*FileDiff),
		Raw:   raw,
	}

	lines := bytes.Split(raw, []byte("\n"))
	var current *FileDiff

	for _, line := range lines {
		s := string(line)

		if strings.HasPrefix(s, "diff --git ") {
			current = nil
			continue
		}
		if strings.HasPrefix(s, "+++ ") {
			path := strings.TrimPrefix(s, "+++ b/")
			if path == "/dev/null" {
				continue
			}
			current = &FileDiff{
				Path:    normalizeRepoPath(path),
				Status:  "modified",
				Changed: true,
			}
			current.IsContract = isContractFile(current.Path)
			d.Files[current.Path] = current
			continue
		}
		if current == nil {
			continue
		}

		switch {
		case strings.HasPrefix(s, "rename from "):
			current.OldPath = normalizeRepoPath(strings.TrimPrefix(s, "rename from "))
		case strings.HasPrefix(s, "rename to "):
			current.Path = normalizeRepoPath(strings.TrimPrefix(s, "rename to "))
			current.Status = "renamed"
			d.Files[current.Path] = current
		case strings.HasPrefix(s, "new file"):
			current.Status = "added"
		case strings.HasPrefix(s, "deleted file"):
			current.Status = "deleted"
		case strings.HasPrefix(s, "+") && !strings.HasPrefix(s, "+++"):
			current.Additions = append(current.Additions, s[1:])
		case strings.HasPrefix(s, "-") && !strings.HasPrefix(s, "---"):
			current.Deletions = append(current.Deletions, s[1:])
		}
	}

	return d
}

// ChangedPaths returns repo-relative paths with any diff activity.
func (d *Diff) ChangedPaths() []string {
	out := make([]string, 0, len(d.Files))
	for p, f := range d.Files {
		if f.Changed {
			out = append(out, p)
		}
	}
	return out
}

// HasChange reports whether path appears in the diff (exact or suffix match).
func (d *Diff) HasChange(repoRel string) bool {
	repoRel = normalizeRepoPath(repoRel)
	if f, ok := d.Files[repoRel]; ok && f.Changed {
		return true
	}
	for p, f := range d.Files {
		if f.Changed && strings.HasSuffix(p, repoRel) {
			return true
		}
	}
	return false
}

func normalizeRepoPath(p string) string {
	return filepath.ToSlash(filepath.Clean(p))
}

func isContractFile(path string) bool {
	return strings.Contains(path, "/interfaces/exports.md") ||
		strings.Contains(path, "/interfaces/imports.md") ||
		strings.HasSuffix(path, "interfaces/exports.md") ||
		strings.HasSuffix(path, "interfaces/imports.md")
}

// RepoRoot validates that dir is inside a git work tree.
func RepoRoot(dir string) (string, error) {
	cmd := exec.Command("git", "rev-parse", "--show-toplevel")
	cmd.Dir = dir
	out, err := cmd.Output()
	if err != nil {
		return "", fmt.Errorf("%s is not a git repository", dir)
	}
	return strings.TrimSpace(string(out)), nil
}

// FileExists is a small helper for contract source resolution.
func FileExists(repo, rel string) bool {
	_, err := os.Stat(filepath.Join(repo, rel))
	return err == nil
}
