export function distance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix: number[][] = Array.from({ length: b.length + 1 }, () =>
    new Array(a.length + 1).fill(0),
  );

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost,
      );
    }
  }

  return matrix[b.length][a.length];
}

export function closestMatch(input: string, options: string[]): string | null {
  let best: string | null = null;
  let bestDist = Infinity;

  for (const opt of options) {
    const d = distance(input, opt);
    if (d < bestDist) {
      bestDist = d;
      best = opt;
    }
  }

  const tolerance = Math.max(1, Math.floor(input.length / 3));
  return bestDist <= tolerance ? best : null;
}
