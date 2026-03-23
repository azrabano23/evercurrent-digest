// this file figures out how important a message is for each person
// think of it like a score on a test — higher score = more important to you right now

// ─── how much does each job care about each type of message ───────────────────
// imagine you asked every person "on a scale of 0 to 1, how much do you care about this?"
// these are their answers

const ROLE_WEIGHTS = {
  'Electrical Engineer': {
    blocker:          0.95, // if something is broken, they need to know right away
    risk:             0.78,
    decision:         0.82, // people ask EEs to approve stuff all the time
    open_question:    0.68,
    milestone_update: 0.60, // schedule is important but not their main thing
    dependency:       0.92, // other people are always waiting on their work
  },
  'Mechanical Engineer': {
    blocker:          0.82,
    risk:             0.78,
    decision:         0.90, // when ME changes a part, everyone else has to adjust
    open_question:    0.62,
    milestone_update: 0.52,
    dependency:       0.70,
  },
  'Supply Chain': {
    blocker:          0.68,
    risk:             0.92, // "the part is delayed" is basically their whole job to catch
    decision:         0.72,
    open_question:    0.82, // unanswered questions can hold up an order
    milestone_update: 0.78, // if the date moves, they need to move the order too
    dependency:       0.60,
  },
  'Engineering Manager': {
    blocker:          0.95, // they need to know everything that's stuck
    risk:             0.95,
    decision:         0.88,
    open_question:    0.95, // open questions usually mean someone is waiting on someone
    milestone_update: 0.90,
    dependency:       0.80,
  },
  'Product Manager': {
    blocker:          0.72,
    risk:             0.88,
    decision:         0.68,
    open_question:    0.85,
    milestone_update: 0.95, // PMs care most about whether the schedule is on track
    dependency:       0.58,
  },
}

// ─── how much does the project phase change things ────────────────────────────
// early on (Prototype) = still figuring stuff out, it's okay if things are messy
// late (PVT) = almost shipping, everything is urgent, no loose ends allowed

const PHASE_WEIGHTS = {
  Prototype: {
    blocker:          1.2,
    risk:             0.55, // risk is normal this early — don't freak out about it
    decision:         1.45, // decisions matter most here, you're still picking direction
    open_question:    1.30,
    milestone_update: 0.45, // nobody is watching the clock yet
    dependency:       0.75,
  },
  EVT: {
    blocker:          1.42,
    risk:             0.88,
    decision:         1.18,
    open_question:    1.10,
    milestone_update: 0.78,
    dependency:       1.20, // teams start depending on each other more here
  },
  DVT: {
    blocker:          1.30,
    risk:             1.22, // risk starts really mattering now
    decision:         1.00,
    open_question:    1.05,
    milestone_update: 1.12,
    dependency:       1.10,
  },
  PVT: {
    blocker:          1.50, // everything is loud in PVT — you're almost done
    risk:             1.45,
    decision:         1.35,
    open_question:    1.50, // if something is unanswered this late, that's a real problem
    milestone_update: 1.42,
    dependency:       1.25,
  },
}

// ─── what does each person actually own ───────────────────────────────────────
// if the message is about something YOU own, it matters way more to you
// like if the PCB breaks, the EE cares more than supply chain does

const ROLE_OWNERSHIP = {
  'Electrical Engineer':  ['PCB', 'Power Board', 'PCB / Firmware', 'Electrical'],
  'Mechanical Engineer':  ['Chassis', 'Chassis / PCB Interface', 'Mechanical'],
  'Supply Chain':         ['Supply Chain', 'Program'],
  'Engineering Manager':  ['Program', 'Electrical', 'Mechanical', 'Firmware', 'Systems'],
  'Product Manager':      ['Program'],
}

// ─── how fresh is this message ────────────────────────────────────────────────
// newer = more important, but it fades slowly because hardware teams don't move as fast as software

function recencyScore(hoursOld) {
  return 1.0 / (1.0 + 0.035 * hoursOld)
}

// ─── does this message touch something the person owns ────────────────────────
// if yes: big boost (1.85x) — this is literally their problem
// if their team is downstream of it: medium boost (1.45x) — they'll be affected soon
// if neither: no boost (1.0x)

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

// ─── how many teams does this affect ─────────────────────────────────────────
// a problem that hits 3 teams is more important to a manager than one that only hits 1 team
// each extra team adds 18% to the score

function crossFunctionalReach(signal) {
  const count = signal.downstreamTeams?.length ?? 0
  return 1.0 + 0.18 * count
}

// ─── the final score ──────────────────────────────────────────────────────────
// multiply everything together to get one number
// that number tells us how important this message is for this person right now

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
    // save each piece so we can show the math in the UI
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

// ─── turn the score into a word ───────────────────────────────────────────────
// instead of showing people a raw number, we label it
// these cutoffs are tuned so you see 1–2 criticals in DVT, not 5

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
