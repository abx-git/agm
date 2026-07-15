package contract

import (
	"os"
	"path/filepath"
	"testing"

	"github.com/abx-git/agm/agm-validator/internal/git"
)

func TestParseExportsFile_SectionFormat(t *testing.T) {
	path := filepath.Join("..", "..", "..", "docs", "examples", "sample-app", "order-service", "docs", "architecture", "interfaces", "exports.md")
	if _, err := os.Stat(path); err != nil {
		t.Skip("sample exports.md not available")
	}

	doc, err := ParseExportsFile(path)
	if err != nil {
		t.Fatalf("ParseExportsFile: %v", err)
	}

	if len(doc.Contracts) < 2 {
		t.Fatalf("expected at least 2 contracts, got %d", len(doc.Contracts))
	}

	var ordAPI *Contract
	for i := range doc.Contracts {
		if doc.Contracts[i].ID == "API-ORD-001" {
			ordAPI = &doc.Contracts[i]
			break
		}
	}
	if ordAPI == nil {
		t.Fatal("API-ORD-001 not found")
	}
	if ordAPI.Type != "api" {
		t.Fatalf("type = %q, want api", ordAPI.Type)
	}
	if len(ordAPI.Methods) == 0 || ordAPI.Methods[0] != "POST /orders" {
		t.Fatalf("methods = %#v, want POST /orders", ordAPI.Methods)
	}
	if !stringsHasSuffix(ordAPI.SourcePath, "src/create_order.ts") {
		t.Fatalf("source = %q", ordAPI.SourcePath)
	}

	linked := doc.ResolvedBySource(filepath.Dir(filepath.Dir(filepath.Dir(filepath.Dir(path)))))
	if len(linked) == 0 {
		t.Fatalf("ResolvedBySource empty for sample exports")
	}
	found := false
	for k := range linked {
		if stringsHasSuffix(k, "create_order.ts") {
			found = true
			break
		}
	}
	if !found {
		t.Fatalf("ResolvedBySource missing create_order.ts, keys=%v", mapKeys(linked))
	}
}

func TestCheckCompliance_SourceChangedWithoutSpec(t *testing.T) {
	repo := filepath.Join("..", "..", "..", "docs", "examples", "sample-app", "order-service")
	exports := filepath.Join(repo, "docs", "architecture", "interfaces", "exports.md")
	if _, err := os.Stat(exports); err != nil {
		t.Skip("sample app not available")
	}

	doc, err := ParseExportsFile(exports)
	if err != nil {
		t.Fatalf("parse: %v", err)
	}

	sourceRel := "src/create_order.ts"
	diff := &git.Diff{
		Files: map[string]*git.FileDiff{
			sourceRel: {
				Path:    sourceRel,
				Changed: true,
				Additions: []string{
					"+export async function createOrder(req: CreateOrderRequest): Promise<Order> {",
				},
			},
		},
	}

	violations := CheckCompliance(doc, "", diff, repo)
	if len(violations) == 0 {
		t.Fatal("expected violation when source changes without exports.md")
	}
	if violations[0].Code != "CONTRACT_SOURCE_WITHOUT_SPEC" {
		t.Fatalf("code = %q", violations[0].Code)
	}
}

func TestCheckCompliance_SourceAndSpecChanged(t *testing.T) {
	repo := filepath.Join("..", "..", "..", "docs", "examples", "sample-app", "order-service")
	exports := filepath.Join(repo, "docs", "architecture", "interfaces", "exports.md")
	doc, err := ParseExportsFile(exports)
	if err != nil {
		t.Skipf("parse: %v", err)
	}

	sourceRel := "src/create_order.ts"
	exportsRel := "docs/architecture/interfaces/exports.md"
	diff := &git.Diff{
		Files: map[string]*git.FileDiff{
			sourceRel: {
				Path:      sourceRel,
				Changed:   true,
				Additions: []string{"+export async function createOrder() {}"},
			},
			exportsRel: {
				Path:       exportsRel,
				Changed:    true,
				IsContract: true,
				Additions:  []string{"+- **Method:** `POST /orders/v2`"},
			},
		},
	}

	violations := CheckCompliance(doc, "", diff, repo)
	for _, v := range violations {
		if v.Code == "CONTRACT_SOURCE_WITHOUT_SPEC" {
			t.Fatalf("unexpected violation: %+v", v)
		}
	}
}

func stringsHasSuffix(s, suffix string) bool {
	return len(s) >= len(suffix) && s[len(s)-len(suffix):] == suffix
}

func mapKeys(m map[string][]Contract) []string {
	keys := make([]string, 0, len(m))
	for k := range m {
		keys = append(keys, k)
	}
	return keys
}
