
export type Mode = 'list' | 'split' | 'pick';

export interface DecisionResult {
  mode: Mode;
  modifier: number;
  data: string[] | string[][];
}

export interface ParseResult {
  mode: Mode;
  modifier: number;
  names: string[];
}
