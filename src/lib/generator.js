import { SIGNALS } from '../data/mockData.js'
import { scoreSignal, priorityFromScore } from './scorer.js'

// takes every signal we have, scores it for the current role + phase,
// then sorts by score and returns the top N
// this runs every time the user switches role or phase in the header

export function generateDigest(role, phase, topN = 5) {
  const scored = SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown }
  })

  // sort highest to lowest and cut to top N
  const ranked = [...scored].sort((a, b) => b.score - a.score).slice(0, topN)

  return ranked.map(({ signal, score, breakdown }) => ({
    ...signal,
    score,
    breakdown,
    priority: priorityFromScore(score),
    // pull the role-specific explanation — falls back to generic if we missed one
    whyItMattersForRole: signal.whyItMatters?.[role] ?? 'Monitor for updates.',
  }))
}

// used in the score explorer — returns everything, not just the top 5
export function scoreAll(role, phase) {
  return SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown, priority: priorityFromScore(score) }
  }).sort((a, b) => b.score - a.score)
}
