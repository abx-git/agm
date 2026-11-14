export interface TektoConfig {
  appName: string;
  docRoot: string;
  aiTool: 'cursor' | 'claude' | 'copilot' | 'generic' | 'kiro';
}

export interface LinkCheckResult {
  status: 'pass' | 'fail';
  brokenLinks: Array<{ file: string; link: string; resolved: string }>;
  filesChecked: number;
}

export interface SteerNowRow {
  owner: string;
  task: string;
  link: string;
}

export interface CheckResult {
  status: 'pass' | 'fail';
  errors: string[];
  warnings: string[];
  checks?: Partial<Record<'core' | 'graph' | 'trace' | 'contract' | 'links', 'pass' | 'fail'>>;
}