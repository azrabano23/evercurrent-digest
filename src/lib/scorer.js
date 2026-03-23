// ─── Role Weights ─────────────────────────────────────────────────────────────
// How much each role cares about each signal type. Scale 0.0–1.0.
// These encode the personalization model for the prototype.

const ROLE_WEIGHTS = {
  'Electrical Engineer': {
    blocker:          0.95,
    risk:             0.78,
    decision:         0.82,
    open_question:    0.68,
    milestone_update: 0.60,
    dependency:       0.92,
  },
  'Mechanical Engineer': {
    blocker:          0.82,
    risk:             0.78,
    decision:         0.90,
    open_question:    0.62,
    milestone_update: 0.52,
    dependency:       0.70,
  },
  'Supply Chain': {
    blocker:          0.68,
    risk:             0.92,
    decision:         0.72,
    open_question:    0.82,
    milestone_update: 0.78,
    dependency:       0.60,
  },
  'Engineering Manager': {
    blocker:          0.95,
    risk:             0.95,
    decision:         0.88,
    open_question:    0.95,
    milestone_update: 0.90,
    dependency:       0.80,
  },
  'Product Manager': {
    blocker:          0.72,
    risk:             0.88,
    decision:         0.68,
    open_question:    0.85,
    milestone_update: 0.95,
    dependency:       0.58,
  },
}

// ─── Phase Weights ────────────────────────────────────────────────────────────
// How much each project phase amplifies each signal type. Scale 0.5–1.5.
// Earlier phases tolerate risk; later phases are extremely intolerant of open items.

const PHASE_WEIGHTS = {
  Prototype: {
    blocker:          1.2,
    risk:             0.55,
    decision:         1.45,
    open_question:    1.30,
    milestone_update: 0.45,
    dependency:       0.75,
  },
  EVT: {
    blocker:          1.42,
    risk:             0.88,
    decision:         1.18,
    open_question:    1.10,
    milestone_update: 0.78,
    dependency:       1.20,
  },
  DVT: {
    blocker:          1.30,
    risk:             1.22,
    decision:         1.00,
    open_question:    1.05,
    milestone_update: 1.12,
    dependency:       1.10,
  },
  PVT: {
    blocker:          1.50,
    risk:             1.45,
    decision:         1.35,
    open_question:    1.50,
    milestone_update: 1.42,
    dependency:       1.25,
  },
}

// ─── Role → Subsystem Ownership Map ──────────────────────────────────────────
// Determines dependency impact multiplier: does this signal touch something the user owns?

const ROLE_OWNERSHIP = {
  'Electrical Engineer':  ['PCB', 'Power Board', 'PCB / Firmware', 'Electrical'],
  'Mechanical Engineer':  ['Chassis', 'Chassis / PCB Interface', 'Mechanical'],
  'Supply Chain':         ['Supply Chain', 'Program'],
  'Engineering Manager':  ['Program', 'Electrical', 'Mechanical', 'Firmware', 'Systems'],
  'Product Manager':      ['Program'],
}

// ─── Recency decay ────────────────────────────────────────────────────────────
// Recent items score higher. Slow decay — hardware teams move slower than software.

function recencyScore(hoursOld) {
  return 1.0 / (1.0 + 0.035 * hoursOld)
}

// ─── Dependency Impact ────────────────────────────────────────────────────────
// Does this signal touch something the user directly owns or is downstream of?

function dependencyImpact(signal, role) {
  const owned = ROLE_OWNERSHIP[role] ?? []
  const subsystemMatch = owned.some(
    (s) => signal.subsystem?.includes(s) || s.includes(signal.subsystem ?? '')
  )
  const teamMatch =
    signal.downstreamTeams?.some((t) =>
      owned.some((o) => o.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(o.toLowerCase()))
    ) ||
    owned.some((o) =>
      signal.owningTeam?.toLowerCase().includes(o.toLowerCase())
    )

  if (subsystemMatch) return 1.85
  if (teamMatch) return 1.45
  return 1.0
}

// ─── Cross-functional Reach ───────────────────────────────────────────────────
// More downstream teams = higher relevance to managers and PMs.

function crossFunctionalReach(signal) {
  const count = signal.downstreamTeams?.length ?? 0
  return 1.0 + 0.18 * count
}

// ─── Main scoring function ────────────────────────────────────────────────────
// score = R_w × P_w × recency × urgency × dep_impact × cf_reach − redundancy

export function scoreSignal(signal, role, phase) {
  const rw      = ROLE_WEIGHTS[role]?.[signal.type] ?? 0.5
  const pw      = PHASE_WEIGHTS[phase]?.[signal.type] ?? 1.0
  const recency = recencyScore(signal.hoursOld)
  const urgency = signal.urgencyMultiplier ?? 1.0
  const dep     = dependencyImpact(signal, role)
  const cf      = crossFunctionalReach(signal)

  const raw = rw * pw * recency * urgency * dep * cf

  return {
    score: Math.max(parseFloat(raw.toFixed(3)), 0),
    breakdown: {
      roleWeight:    rw.toFixed(2),
      phaseWeight:   pw.toFixed(2),
      recency:       recency.toFixed(3),
      urgency:       urgency.toFixed(1),
      depImpact:     dep.toFixed(2),
      cfReach:       cf.toFixed(2),
    },
  }
}

// ─── Priority tier from score ─────────────────────────────────────────────────

export function priorityFromScore(score) {
  if (score >= 1.80) return 'CRITICAL'
  if (score >= 1.00) return 'HIGH'
  if (score >= 0.50) return 'MEDIUM'
  return 'LOW'
}

export function priorityColor(priority) {
  const map = {
    CRITICAL: '#f85149',
    HIGH:     '#f0883e',
    MEDIUM:   '#d29922',
    LOW:      '#3fb950',
  }
  return map[priority] ?? '#8b949e'
}
