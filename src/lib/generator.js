import { SIGNALS } from '../data/mockData.js'
import { scoreSignal, priorityFromScore } from './scorer.js'

// Generate a personalized, ranked digest for a given role and phase.
// Returns top N scored signals with priority, explanation, and impact chain attached.

export function generateDigest(role, phase, topN = 5) {
  const scored = SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown }
  })

  const ranked = [...scored].sort((a, b) => b.score - a.score).slice(0, topN)

  return ranked.map(({ signal, score, breakdown }) => ({
    ...signal,
    score,
    breakdown,
    priority: priorityFromScore(score),
    whyItMattersForRole: signal.whyItMatters?.[role] ?? 'Monitor for updates.',
  }))
}

// Return ALL signals scored (for the score explorer panel)
export function scoreAll(role, phase) {
  return SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown, priority: priorityFromScore(score) }
  }).sort((a, b) => b.score - a.score)
}
