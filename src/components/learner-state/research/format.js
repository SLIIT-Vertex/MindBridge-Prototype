/** Formatting helpers for the learner-state research cards. */

export function prob(value) {
  if (value == null || Number.isNaN(value)) return '—';
  return value.toFixed(2);
}

export function pct(value) {
  if (value == null || Number.isNaN(value)) return '—';
  return `${Math.round(value * 100)}%`;
}

export function sigma(z) {
  if (z == null || Number.isNaN(z)) return '—';
  return `${z > 0 ? '+' : ''}${z.toFixed(2)}σ`;
}

export function seconds(value) {
  if (value == null) return '—';
  return `${value}s`;
}
