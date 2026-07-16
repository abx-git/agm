/** Per-workflow user fields (name → placeholder in workflow prompt). Ported from docs/assistant/app.js */
export interface WorkflowInputField {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  type?: 'checkbox';
  defaultChecked?: boolean;
  help?: string;
}

export const WORKFLOW_INPUTS: Record<string, WorkflowInputField[]> = {
  'architecture-work-interrogate': [
    { name: 'question', label: 'Your goal / question', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'architecture-work-query': [
    { name: 'question', label: 'Your question', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'architecture-work-analysis': [
    { name: 'topic', label: 'Topic', required: true },
    { name: 'scope', label: 'Scope', required: true },
    { name: 'focus', label: 'Focus', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'architecture-work-design': [
    { name: 'goal', label: 'Goal', required: true },
    { name: 'constraints', label: 'Constraints (optional)', required: false },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'architecture-work-sustainable-analysis': [
    { name: 'scope', label: 'Scope', required: false },
    { name: 'sourcePaths', label: 'Source paths (optional)', required: false },
    { name: 'compareDocs', label: 'Compare to documented architecture', type: 'checkbox', defaultChecked: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'architecture-work-sustainable-interrogate': [
    { name: 'initialGoal', label: 'Initial goal (optional)', required: false },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-event-storm': [
    { name: 'processOrContext', label: 'Process / bounded context (optional)', required: false },
    { name: 'initialGoal', label: 'Initial goal (optional)', required: false },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-context-map': [
    { name: 'scope', label: 'Scope', required: true },
    { name: 'focus', label: 'Focus (optional)', required: false },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-subdomain-classification': [
    { name: 'businessScope', label: 'Business scope', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-integration-review': [
    { name: 'scope', label: 'Scope', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-tactical-review': [
    { name: 'boundedContext', label: 'Bounded context', required: true },
    { name: 'scope', label: 'Source paths', required: true },
    { name: 'compareModel', label: 'Compare to model doc', type: 'checkbox', defaultChecked: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-language-audit': [
    { name: 'scope', label: 'Scope', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-query': [
    { name: 'question', label: 'Domain question', required: true },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  'domain-work-design': [
    { name: 'goal', label: 'Goal', required: true },
    { name: 'boundedContext', label: 'Bounded context', required: true },
    { name: 'constraints', label: 'Constraints (optional)', required: false },
    { name: 'slug', label: 'Work file slug', required: true },
  ],
  refinement: [
    { name: 'goal', label: 'What should improve?', required: true },
    { name: 'sessionFocusDetail', label: 'Focus detail (optional)', required: false },
  ],
  'content-ingest': [
    { name: 'sourceLabel', label: 'Source label', required: true },
    { name: 'sourceType', label: 'Source type', required: true },
    { name: 'goal', label: 'What should be incorporated?', required: true },
    { name: 'slug', label: 'Ingest file slug', required: true },
    { name: 'sessionFocusDetail', label: 'Scope detail (optional)', required: false },
    { name: 'pastedContent', label: 'Pasted content', required: true, multiline: true },
  ],
  maintenance: [{ name: 'gitDiff', label: 'Git diff or PR summary', required: true, multiline: true }],
  'maintenance-diff-range': [
    { name: 'diffFrom', label: 'Start ref (DIFF_FROM)', required: true },
    { name: 'diffTo', label: 'End ref (DIFF_TO)', required: false },
  ],
  'review-phase': [{ name: 'slug', label: 'Review report slug', required: true }],
};

export const DIALOG_WORKFLOW_IDS = new Set([
  'architecture-work-interrogate',
  'architecture-work-sustainable-interrogate',
  'domain-work-event-storm',
]);

export const EVOLVE_WORKFLOW_IDS = new Set([
  'refinement',
  'maintenance',
  'maintenance-diff-range',
  'content-ingest',
]);
