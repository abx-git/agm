export type TektoCheckName = 'core' | 'graph' | 'trace' | 'contract';

export interface RunCheckOptions {
  checks?: TektoCheckName[];
  /** Run tekto-validator/agm-validator for contract compliance when installed */
  withValidator?: boolean;
}

export const DEFAULT_CHECKS: TektoCheckName[] = ['core', 'graph', 'trace'];

export function normalizeChecks(requested?: TektoCheckName[]): TektoCheckName[] {
  if (!requested?.length) return [...DEFAULT_CHECKS];
  return requested;
}