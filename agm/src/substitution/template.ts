const TEMPLATE_HINTS: Record<string, { exampleSection: string }> = {
  arc42: { exampleSection: 'arc42/runtime.md' },
  'c4-light': { exampleSection: 'c4-light/components.md' },
  'adr-first': { exampleSection: 'adr-first/views.md' },
  'lean-service': { exampleSection: 'lean-service/runtime.md' },
  custom: { exampleSection: 'custom/overview.md' },
};

export function templateExampleSection(templateId: string): string {
  const t = templateId || 'arc42';
  return (TEMPLATE_HINTS[t] || { exampleSection: `${t}/overview.md` }).exampleSection;
}

/** Replace <template> tokens and legacy arc42-only wording. Ported from docs/assistant/app.js */
export function substituteTemplate(text: string, templateId: string): string {
  const t = templateId || 'arc42';
  const example = templateExampleSection(t);
  let out = String(text)
    .replace(/<template-example-section>/g, example)
    .replace(/<template>/g, t);

  out = out
    .replace(/\barc42\/decisions\/?/gi, `${t}/decisions/`)
    .replace(/\barc42\//gi, `${t}/`)
    .replace(/modules, services, or arc42 sections/gi, `modules, services, or ${t} sections`)
    .replace(/relevant work\/ items and arc42 sections/gi, `relevant work/ items and ${t} sections`)
    .replace(/follow imports\/exports, arc42, and ops links/gi, `follow imports/exports, ${t}/, and ops links`)
    .replace(/specific arc42 sections/gi, `specific ${t} sections`)
    .replace(/Resume arc42 phases/gi, 'Resume blueprint phases')
    .replace(/After each arc42 phase/gi, 'After each blueprint phase')
    .replace(
      /arc42 paths, modules, or blueprint phase numbers/gi,
      `paths under ${t}/, modules, or blueprint phase numbers`
    )
    .replace(/e\.g\. extend arc42\/[\w.-]+[^\n]*/gi, `e.g. extend ${example} with …`);

  return out;
}
