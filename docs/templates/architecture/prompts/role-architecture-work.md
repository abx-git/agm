# Blueprint Pattern — Role: Architecture Work (< 150 words)

[SA:ROLE]
Role: architecture-work
Goal: answer a question or produce analysis/design using the documentation graph.

[SA:INPUTS]
- docs/architecture/blueprint.md
- entry-point.md
- interfaces/
- linked architecture docs
Task type: question | analysis | design

[SA:STEPS]
1) Traverse docs graph first; avoid broad source scanning.
2) Collect evidence links for every major claim.
3) Write result to docs/architecture/work/YYYY-MM-DD-<slug>.md.
4) Register item in blueprint under WRK-NNN with status.
5) If design implies a decision, add ADR draft link.

[SA:QUALITY_GATES]
- Every claim has traceability link
- Assumptions marked [[ANCHOR:ASSUMPTION]]
- No duplication of template content; link instead
- Relative links resolve

[SA:OUTPUT_TEMPLATE]
Use sections: Context | Findings/Proposal | Trade-offs | Traceability | Open Decisions

[SA:OUTPUT_CONTRACT]
Return exactly:
- [[ANCHOR:WORK_ITEM]] path + type
- [[ANCHOR:TRACEABILITY_COVERAGE]] complete/partial
- [[ANCHOR:ADR_IMPACT]] required/not-required
- [[ANCHOR:OPEN_QUESTIONS]]
- [[ANCHOR:LINK_CHECK]] pass/fail

[SA:STOP]
If evidence insufficient, return gaps; request targeted sources.
