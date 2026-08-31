export function formatPercent(fraction) {
  if (fraction == null) return null;
  return `${Math.round(fraction * 100)}%`;
}

export function formatSeconds(ms) {
  if (!ms) return null;
  return `${(ms / 1000).toFixed(1)}s`;
}
