package mcp

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"strings"

	"github.com/abx-git/blueprint-pattern/agm-validator/internal/report"
	"github.com/abx-git/blueprint-pattern/agm-validator/internal/validate"
)

// Serve starts the MCP server on stdio (JSON-RPC 2.0 + Content-Length framing).
func Serve(version string, _ []string) error {
	s := &server{
		version: version,
		in:      os.Stdin,
		out:     os.Stdout,
	}
	return s.loop()
}

type server struct {
	version    string
	in         io.Reader
	out        io.Writer
	initialized bool
}

type rpcRequest struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      json.RawMessage `json:"id"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params"`
}

type rpcResponse struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      json.RawMessage `json:"id,omitempty"`
	Result  any         `json:"result,omitempty"`
	Error   *rpcError   `json:"error,omitempty"`
}

type rpcError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func (s *server) loop() error {
	for {
		req, err := readMessage(s.in)
		if err != nil {
			if err == io.EOF {
				return nil
			}
			return err
		}

		var rpc rpcRequest
		if err := json.Unmarshal(req, &rpc); err != nil {
			continue
		}

		if rpc.Method == "notifications/initialized" || strings.HasPrefix(rpc.Method, "notifications/") {
			continue
		}

		resp := s.handle(rpc)
		if resp == nil {
			continue
		}
		if err := writeMessage(s.out, resp); err != nil {
			return err
		}
	}
}

func (s *server) handle(req rpcRequest) *rpcResponse {
	switch req.Method {
	case "initialize":
		s.initialized = true
		return &rpcResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Result: map[string]any{
				"protocolVersion": "2024-11-05",
				"capabilities": map[string]any{
					"tools": map[string]any{},
				},
				"serverInfo": map[string]string{
					"name":    "agm-validator",
					"version": s.version,
				},
			},
		}
	case "tools/list":
		return &rpcResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Result: map[string]any{
				"tools": []map[string]any{
					{
						"name":        "agm_validate_diff",
						"description": "Run deterministic AGM architecture checks against the current git diff (contract compliance, traceability, graph sync).",
						"inputSchema": map[string]any{
							"type": "object",
							"properties": map[string]any{
								"repo": map[string]any{
									"type":        "string",
									"description": "Git repository root (default: current working directory)",
								},
								"staged": map[string]any{
									"type":        "boolean",
									"description": "Inspect staged changes only (pre-commit mode)",
								},
								"base": map[string]any{
									"type":        "string",
									"description": "Git ref to diff against (default: HEAD)",
								},
								"arch": map[string]any{
									"type":        "string",
									"description": "Architecture docs root relative to repo (default: docs/architecture)",
								},
								"checks": map[string]any{
									"type":        "array",
									"items":       map[string]string{"type": "string"},
									"description": "Checks to run: contract, trace, graph (default: [contract])",
								},
							},
						},
					},
					{
						"name":        "agm_validator_status",
						"description": "Return agm-validator version and available checks.",
						"inputSchema": map[string]any{
							"type":       "object",
							"properties": map[string]any{},
						},
					},
				},
			},
		}
	case "tools/call":
		return s.handleToolCall(req)
	case "ping":
		return &rpcResponse{JSONRPC: "2.0", ID: req.ID, Result: map[string]any{}}
	default:
		return &rpcResponse{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error:   &rpcError{Code: -32601, Message: "method not found: " + req.Method},
		}
	}
}

func (s *server) handleToolCall(req rpcRequest) *rpcResponse {
	var params struct {
		Name      string         `json:"name"`
		Arguments map[string]any `json:"arguments"`
	}
	if err := json.Unmarshal(req.Params, &params); err != nil {
		return errResp(req.ID, -32602, "invalid params")
	}

	switch params.Name {
	case "agm_validator_status":
		text, _ := json.MarshalIndent(map[string]any{
			"product":  "agm-validator",
			"version":  s.version,
			"checks":   []string{"contract", "trace", "graph"},
			"contract": "implemented",
			"trace":    "planned",
			"graph":    "planned",
		}, "", "  ")
		return toolResult(req.ID, string(text), false)

	case "agm_validate_diff":
		opts := validate.Options{
			Repo:     stringArg(params.Arguments, "repo", "."),
			Staged:   boolArg(params.Arguments, "staged", false),
			Base:     stringArg(params.Arguments, "base", "HEAD"),
			ArchRoot: stringArg(params.Arguments, "arch", validate.DefaultArchRoot),
			Checks:   stringSliceArg(params.Arguments, "checks"),
		}

		result, err := validate.Run(opts)
		if err != nil {
			return toolResult(req.ID, err.Error(), true)
		}
		result.Version = s.version

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
			return toolResult(req.ID, err.Error(), true)
		}

		summary := report.FormatAll(result.Checks)
		combined := summary + "\n--- JSON ---\n" + string(b)
		return toolResult(req.ID, combined, result.ErrorCount() > 0)

	default:
		return errResp(req.ID, -32602, "unknown tool: "+params.Name)
	}
}

func toolResult(id json.RawMessage, text string, isError bool) *rpcResponse {
	return &rpcResponse{
		JSONRPC: "2.0",
		ID:      id,
		Result: map[string]any{
			"content": []map[string]string{
				{"type": "text", "text": text},
			},
			"isError": isError,
		},
	}
}

func errResp(id json.RawMessage, code int, msg string) *rpcResponse {
	return &rpcResponse{
		JSONRPC: "2.0",
		ID:      id,
		Error:   &rpcError{Code: code, Message: msg},
	}
}

func readMessage(r io.Reader) ([]byte, error) {
	br := bufio.NewReader(r)
	var contentLength int
	for {
		line, err := br.ReadString('\n')
		if err != nil {
			return nil, err
		}
		line = strings.TrimSpace(line)
		if line == "" {
			break
		}
		if strings.HasPrefix(strings.ToLower(line), "content-length:") {
			fmt.Sscanf(line, "Content-Length: %d", &contentLength)
		}
	}
	if contentLength <= 0 {
		return nil, fmt.Errorf("missing Content-Length")
	}
	buf := make([]byte, contentLength)
	if _, err := io.ReadFull(br, buf); err != nil {
		return nil, err
	}
	return buf, nil
}

func writeMessage(w io.Writer, v any) error {
	b, err := json.Marshal(v)
	if err != nil {
		return err
	}
	_, err = fmt.Fprintf(w, "Content-Length: %d\r\n\r\n%s", len(b), b)
	return err
}

func stringArg(m map[string]any, key, def string) string {
	if m == nil {
		return def
	}
	v, ok := m[key]
	if !ok {
		return def
	}
	s, ok := v.(string)
	if !ok || s == "" {
		return def
	}
	return s
}

func boolArg(m map[string]any, key string, def bool) bool {
	if m == nil {
		return def
	}
	v, ok := m[key]
	if !ok {
		return def
	}
	b, ok := v.(bool)
	if !ok {
		return def
	}
	return b
}

func stringSliceArg(m map[string]any, key string) []string {
	if m == nil {
		return nil
	}
	v, ok := m[key]
	if !ok {
		return nil
	}
	arr, ok := v.([]any)
	if !ok {
		return nil
	}
	out := make([]string, 0, len(arr))
	for _, item := range arr {
		if s, ok := item.(string); ok {
			out = append(out, s)
		}
	}
	return out
}
