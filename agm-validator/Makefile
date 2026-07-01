VERSION ?= 0.1.0
MODULE  := github.com/abx-git/blueprint-pattern/agm-validator/internal/cli
LDFLAGS := -s -w -X $(MODULE).Version=$(VERSION)
OUT     := dist
BINARY  := agm-validator

.PHONY: build release clean test

build:
	go build -ldflags "$(LDFLAGS)" -o $(BINARY) ./cmd/agm-validator

test:
	go test ./...

clean:
	rm -rf $(OUT) $(BINARY)

# Release matrix for commercial distribution.
release: clean
	@mkdir -p $(OUT)
	GOOS=darwin  GOARCH=arm64 go build -ldflags "$(LDFLAGS)" -o $(OUT)/$(BINARY)-darwin-arm64  ./cmd/agm-validator
	GOOS=darwin  GOARCH=amd64 go build -ldflags "$(LDFLAGS)" -o $(OUT)/$(BINARY)-darwin-amd64  ./cmd/agm-validator
	GOOS=linux   GOARCH=amd64 go build -ldflags "$(LDFLAGS)" -o $(OUT)/$(BINARY)-linux-amd64   ./cmd/agm-validator
	GOOS=linux   GOARCH=arm64 go build -ldflags "$(LDFLAGS)" -o $(OUT)/$(BINARY)-linux-arm64   ./cmd/agm-validator
	@sha256sum $(OUT)/* > $(OUT)/SHA256SUMS 2>/dev/null || shasum -a 256 $(OUT)/* > $(OUT)/SHA256SUMS
	@echo "release artifacts in $(OUT)/"
