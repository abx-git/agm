export type TemplateId = 'arc42' | 'c4-light' | 'adr-first' | 'lean-service' | 'custom';

export interface AgmConfig {
  appName: string;
  template: TemplateId;
  customTemplate?: string;
  docRoot: string;
  /** Absolute path for external work/ (symlink target outside Git). */
  workDir?: string;
  stack: string;
  purpose?: string;
  sourceRoot?: string;
  docFocus?: string[];
  /** Directory with workflows-prompts.json (private pack). Overrides AGM_PROMPTS_PATH. */
  promptsPath?: string;
}

/** Public workflow metadata — no prompt body (safe to ship). */
export interface WorkflowCatalogEntry {
  id: string;
  track: string;
  activity: string;
  mode: string;
  role: string;
  /** @deprecated Use `track` — kept for Assistant UI grouping */
  group: string;
  when: string;
  prerequisite: string;
  freshChat: boolean;
  freshNote: string;
  anchors: string[];
  steps: string[];
  placeholders: string[];
}

/** Full workflow for execution — prompt loaded from private pack. */
export interface Workflow extends WorkflowCatalogEntry {
  prompt: string;
}

export interface AnchorDef {
  id: string;
  meaning: string;
  workflows: string[];
}

export type PhaseState = 'open' | 'in_progress' | 'done' | 'blocked';

export interface BlueprintPhase {
  phase: string;
  section: string;
  targetFile: string;
  state: PhaseState;
  lastUpdated: string;
}

export interface WorkRegisterItem {
  id: string;
  track: string;
  title: string;
  type: string;
  file: string;
  status: string;
  date: string;
}

export interface GuardrailFinding {
  file: string;
  finding: string;
  severity: string;
  source: string;
}

export interface GraphStatus {
  docRoot: string;
  template: string;
  openPhases: BlueprintPhase[];
  inProgressPhases: BlueprintPhase[];
  activeWorkItems: WorkRegisterItem[];
  guardrailFindings: GuardrailFinding[];
}

export interface LinkCheckResult {
  status: 'pass' | 'fail';
  brokenLinks: Array<{ file: string; link: string; resolved: string }>;
  filesChecked: number;
}

export interface WorkflowTriggerParams {
  workflowId: string;
  goal?: string;
  parameters?: Record<string, string | boolean | undefined>;
  diffFrom?: string;
  diffTo?: string;
}
