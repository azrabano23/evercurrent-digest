import { SIGNALS } from '../data/mockData.js'
import { scoreSignal, priorityFromScore } from './scorer.js'

// this is like a chef picking the best dishes for you specifically
// it takes every signal, scores it for YOUR role and YOUR phase,
// then puts the most important ones at the top

export function generateDigest(role, phase, topN = 5) {
  // score every signal
  const scored = SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown }
  })

  // sort from highest score to lowest, then take the top 5
  const ranked = [...scored].sort((a, b) => b.score - a.score).slice(0, topN)

  return ranked.map(({ signal, score, breakdown }) => ({
    ...signal,
    score,
    breakdown,
    priority: priorityFromScore(score),
    // each signal has a different explanation written for each role
    // like the same fire alarm means different things to the firefighter vs the office worker
    whyItMattersForRole: signal.whyItMatters?.[role] ?? 'Monitor for updates.',
  }))
}

// same thing but returns ALL signals — used in the score explorer so you can see everything
export function scoreAll(role, phase) {
  return SIGNALS.map((signal) => {
    const { score, breakdown } = scoreSignal(signal, role, phase)
    return { signal, score, breakdown, priority: priorityFromScore(score) }
  }).sort((a, b) => b.score - a.score)
}
