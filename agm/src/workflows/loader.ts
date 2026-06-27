import { readFileSync } from 'node:fs';
import type { AgmConfig, AnchorDef, Workflow, WorkflowCatalogEntry } from '../types.js';
import { dataPath } from '../paths.js';
import { loadPromptMap, PromptPackNotFoundError } from '../config/prompts-path.js';

let catalogCache: WorkflowCatalogEntry[] | null = null;
let anchorsCache: AnchorDef[] | null = null;

export function loadWorkflowCatalog(): WorkflowCatalogEntry[] {
  if (!catalogCache) {
    catalogCache = JSON.parse(
      readFileSync(dataPath('workflows-catalog.json'), 'utf8')
    ) as WorkflowCatalogEntry[];
  }
  return catalogCache;
}

export function loadAnchors(): AnchorDef[] {
  if (!anchorsCache) {
    anchorsCache = JSON.parse(readFileSync(dataPath('anchors.json'), 'utf8')) as AnchorDef[];
  }
  return anchorsCache;
}

export function getCatalogEntryById(id: string): WorkflowCatalogEntry | undefined {
  return loadWorkflowCatalog().find((w) => w.id === id);
}

/** Full workflow with prompt — requires private prompt pack. */
export function getWorkflowById(id: string, config: AgmConfig, cwd = process.cwd()): Workflow | undefined {
  const entry = getCatalogEntryById(id);
  if (!entry) return undefined;

  const prompts = loadPromptMap(config, cwd);
  const prompt = prompts[id];
  if (!prompt) {
    throw new Error(
      `Workflow "${id}" exists in catalog but has no prompt in the private pack. ` +
        'Update workflows-prompts.json or run scripts/agm-split-prompts.mjs.'
    );
  }

  return { ...entry, prompt };
}

/** @deprecated Use loadWorkflowCatalog for public listing */
export function loadWorkflows(): WorkflowCatalogEntry[] {
  return loadWorkflowCatalog();
}

export function listWorkflowIds(): string[] {
  return loadWorkflowCatalog().map((w) => w.id);
}

export function anchorsForWorkflow(workflowId: string): AnchorDef[] {
  return loadAnchors().filter((a) => {
    if (a.workflows.includes('*')) return true;
    return a.workflows.some((pattern) => {
      if (pattern.endsWith('*')) {
        return workflowId.startsWith(pattern.slice(0, -1));
      }
      return pattern === workflowId;
    });
  });
}

export { PromptPackNotFoundError };
