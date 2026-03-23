// this is the brain of the whole thing
// it takes a slack signal and a role + phase and spits out a number
// higher number = more important for that person right now

// ─── role weights ─────────────────────────────────────────────────────────────
// basically: how much does each role actually care about each type of signal?
// 0.0 = barely relevant, 1.0 = this is exactly what they need to see
// i set these based on what each job actually does day to day

const ROLE_WEIGHTS = {
  'Electrical Engineer': {
    blocker:          0.95, // if something is blocked, EE needs to know immediately
    risk:             0.78,
    decision:         0.82, // EEs get tagged in design decisions a lot
    open_question:    0.68,
    milestone_update: 0.60, // they care about schedule but it's not their main thing
    dependency:       0.92, // really high — their work blocks other people constantly
  },
  'Mechanical Engineer': {
    blocker:          0.82,
    risk:             0.78,
    decision:         0.90, // MEs make a lot of physical design calls that ripple downstream
    open_question:    0.62,
    milestone_update: 0.52,
    dependency:       0.70,
  },
  'Supply Chain': {
    blocker:          0.68,
    risk:             0.92, // supplier risk is literally their whole job
    decision:         0.72,
    open_question:    0.82, // unanswered questions can stall a PO
    milestone_update: 0.78, // they need to know when dates shift so they can move orders
    dependency:       0.60,
  },
  'Engineering Manager': {
    blocker:          0.95, // EMs need to see everything that's stuck
    risk:             0.95,
    decision:         0.88,
    open_question:    0.95, // open questions at this stage usually mean someone's waiting on someone
    milestone_update: 0.90,
    dependency:       0.80,
  },
  'Product Manager': {
    blocker:          0.72,
    risk:             0.88,
    decision:         0.68,
    open_question:    0.85,
    milestone_update: 0.95, // PMs live and die by the schedule
    dependency:       0.58,
  },
}

// ─── phase weights ────────────────────────────────────────────────────────────
// same signal, different phase = different urgency
// early on (prototype), risk is fine — you're still figuring stuff out
// later (PVT), every open item is a potential launch blocker

const PHASE_WEIGHTS = {
  Prototype: {
    blocker:          1.2,
    risk:             0.55, // risk is expected early, don't over-alarm
    decision:         1.45, // decisions matter most here — still setting direction
    open_question:    1.30,
    milestone_update: 0.45, // nobody's sweating the schedule in prototype
    dependency:       0.75,
  },
  EVT: {
    blocker:          1.42,
    risk:             0.88,
    decision:         1.18,
    open_question:    1.10,
    milestone_update: 0.78,
    dependency:       1.20, // dependencies really start mattering in EVT
  },
  DVT: {
    blocker:          1.30,
    risk:             1.22, // risk becomes a bigger deal in DVT
    decision:         1.00,
    open_question:    1.05,
    milestone_update: 1.12,
    dependency:       1.10,
  },
  PVT: {
    blocker:          1.50, // in PVT everything is urgent
    risk:             1.45,
    decision:         1.35,
    open_question:    1.50, // if something is unanswered in PVT, that's a problem
    milestone_update: 1.42,
    dependency:       1.25,
  },
}

// ─── what does each role actually own ────────────────────────────────────────
// if a signal touches something the person owns, it scores way higher
// like an EE doesn't need to see every chassis thread — only the ones that touch their board

const ROLE_OWNERSHIP = {
  'Electrical Engineer':  ['PCB', 'Power Board', 'PCB / Firmware', 'Electrical'],
  'Mechanical Engineer':  ['Chassis', 'Chassis / PCB Interface', 'Mechanical'],
  'Supply Chain':         ['Supply Chain', 'Program'],
  'Engineering Manager':  ['Program', 'Electrical', 'Mechanical', 'Firmware', 'Systems'],
  'Product Manager':      ['Program'],
}

// ─── recency: how fresh is this signal ────────────────────────────────────────
// newer = more important, but hardware teams move slow so the decay is gentle
// something from 24 hours ago is still very relevant

function recencyScore(hoursOld) {
  return 1.0 / (1.0 + 0.035 * hoursOld)
}

// ─── does this signal touch something the user owns ───────────────────────────
// if the signal is literally in your subsystem → big boost (1.85x)
// if your team is downstream of it → medium boost (1.45x)
// otherwise no boost

function dependencyImpact(signal, role) {
  const owned = ROLE_OWNERSHIP[role] ?? []

  const subsystemMatch = owned.some(
    (s) => signal.subsystem?.includes(s) || s.includes(signal.subsystem ?? '')
  )

  const teamMatch =
    signal.downstreamTeams?.some((t) =>
      owned.some(
        (o) => o.toLowerCase().includes(t.toLowerCase()) || t.toLowerCase().includes(o.toLowerCase())
      )
    ) ||
    owned.some((o) => signal.owningTeam?.toLowerCase().includes(o.toLowerCase()))

  if (subsystemMatch) return 1.85
  if (teamMatch) return 1.45
  return 1.0
}

// ─── cross-functional reach ───────────────────────────────────────────────────
// the more teams are affected by a signal, the more a manager or PM needs to see it
// each extra downstream team adds 18% to the score

function crossFunctionalReach(signal) {
  const count = signal.downstreamTeams?.length ?? 0
  return 1.0 + 0.18 * count
}

// ─── the actual score formula ─────────────────────────────────────────────────
// multiply all the factors together
// role weight × phase weight × recency × urgency × ownership boost × reach

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
    // store each factor so we can show the breakdown in the UI
    breakdown: {
      roleWeight:  rw.toFixed(2),
      phaseWeight: pw.toFixed(2),
      recency:     recency.toFixed(3),
      urgency:     urgency.toFixed(1),
      depImpact:   dep.toFixed(2),
      cfReach:     cf.toFixed(2),
    },
  }
}

// ─── turn a score into a priority label ───────────────────────────────────────
// these thresholds are tuned so that in DVT you see 1-2 criticals max
// not everything is critical — that defeats the purpose

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
