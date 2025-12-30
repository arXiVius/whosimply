
import { ParseResult, DecisionResult, Mode } from '../types';

export function shuffle<T,>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function parseInput(raw: string): ParseResult {
  const lines = raw.split('\n').map(l => l.trim()).filter(l => l !== '');
  let mode: Mode = 'list';
  let modifier = 0;
  const names: string[] = [];

  lines.forEach(line => {
    const splitMatch = line.toLowerCase().match(/split (\d+)/);
    const pickMatch = line.toLowerCase().match(/pick (\d+)/);
    
    if (splitMatch) {
      mode = 'split';
      modifier = parseInt(splitMatch[1]);
    } else if (pickMatch) {
      mode = 'pick';
      modifier = parseInt(pickMatch[1]);
    } else {
      names.push(line);
    }
  });

  return { mode, modifier, names };
}

export function executeDecision(input: string): DecisionResult | null {
  const { mode, modifier, names } = parseInput(input);
  if (names.length === 0) return null;

  const shuffled = shuffle(names);

  if (mode === 'pick') {
    const count = modifier || 1;
    return {
      mode,
      modifier: count,
      data: shuffled.slice(0, count)
    };
  }

  if (mode === 'split') {
    const teamCount = modifier || 2;
    const teams: string[][] = Array.from({ length: teamCount }, () => []);
    shuffled.forEach((name, i) => {
      teams[i % teamCount].push(name);
    });
    return {
      mode,
      modifier: teamCount,
      data: teams
    };
  }

  return {
    mode: 'list',
    modifier: 0,
    data: shuffled
  };
}
