# Diagrams

Mermaid diagrams used in AGM documentation. They render natively on GitHub and in most Markdown viewers.

## Lifecycle

See [AGM for architects](../article/blueprint-pattern-for-architects.md) for:

- Repository link graph (Blueprint → entry-point → imports/exports → source)
- Cross-service dependency trace (order → payment → notification)
- Bootstrap / Refinement / Maintenance workflow

## Sample application

Runtime and context diagrams live inline in the sample app:

- [order-service runtime](../examples/sample-app/order-service/docs/architecture/arc42/runtime.md)
- [ecosystem index](../examples/sample-app/ecosystem-index.md)

## Exporting for presentations

To export Mermaid to SVG for slides:

```bash
npx @mermaid-js/mermaid-cli -i diagram.mmd -o diagram.svg
```

Copy the ` ```mermaid ` block content into a `.mmd` file first.
