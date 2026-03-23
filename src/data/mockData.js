// ─── Slack Threads (raw mock input) ──────────────────────────────────────────

export const SLACK_THREADS = [
  {
    id: 'thread-001',
    channel: '#supply-chain',
    channelDescription: 'A part we ordered won\'t arrive in time — need an approved swap fast',
    channelColor: '#f0a500',
    messages: [
      {
        id: 'msg-001',
        author: 'Sarah Kim',
        initials: 'SK',
        avatarColor: '#f0a500',
        role: 'Supply Chain Manager',
        timestamp: 'Yesterday 2:23 PM',
        text: "Heads up — Murata just confirmed the push. Lead time on C47 (100µF 16V X5R, GRM31CR61C107MA01) went from 8 to 14 weeks. We ordered for the DVT build and it's not going to make it. This part is the main bulk decoupling cap on the power board. No approved alternates on file.",
      },
      {
        id: 'msg-002',
        author: 'James Wu',
        initials: 'JW',
        avatarColor: '#58a6ff',
        role: 'Procurement',
        timestamp: 'Yesterday 2:41 PM',
        text: "I can pull a TDK equivalent — GRM31CR61C107KA01L looks compatible on paper. But it's not on the AVL. Who do we need to sign off on alternates?",
      },
      {
        id: 'msg-003',
        author: 'Sarah Kim',
        initials: 'SK',
        avatarColor: '#f0a500',
        role: 'Supply Chain Manager',
        timestamp: 'Yesterday 2:44 PM',
        text: "Engineering has to approve AVL changes. Tagging @Alex Chen — this is on the power board. If we don't get approval in 2 weeks we can't place the DVT PO.",
      },
    ],
  },
  {
    id: 'thread-002',
    channel: '#evb-bring-up',
    channelDescription: 'Power is dead on the circuit board — firmware team can\'t do anything until it\'s fixed',
    channelColor: '#58a6ff',
    note: '⚠ Thread open 18 hours — no update posted',
    messages: [
      {
        id: 'msg-004',
        author: 'Alex Chen',
        initials: 'AC',
        avatarColor: '#3fb950',
        role: 'Electrical Engineer',
        timestamp: 'Yesterday 9:15 AM',
        text: "U7 power rail is not coming up. Measuring 0V at TP23. Best guess is either a DNP resistor that shouldn't be DNP'd (R112 or R113) or a layout short near the switcher. Pulling schematics now.",
      },
      {
        id: 'msg-005',
        author: 'Priya Sharma',
        initials: 'PS',
        avatarColor: '#bc8cff',
        role: 'Firmware Engineer',
        timestamp: 'Yesterday 9:31 AM',
        text: "We need that U7 rail for IMU and sensor init. Firmware bring-up is blocked on this. We can work around it today but if it's not resolved by tomorrow morning we start slipping.",
      },
      {
        id: 'msg-006',
        author: 'Alex Chen',
        initials: 'AC',
        avatarColor: '#3fb950',
        role: 'Electrical Engineer',
        timestamp: 'Yesterday 9:45 AM',
        text: "On it, will update EOD. R112 looks like the culprit based on the net. Need to check fab files.",
      },
    ],
  },
  {
    id: 'thread-003',
    channel: '#dvt-testing',
    channelDescription: 'The robot chassis cracked during a shake test — needs a redesign before next build',
    channelColor: '#3fb950',
    note: '⚠ ME/EE sync not yet scheduled',
    messages: [
      {
        id: 'msg-007',
        author: 'Raj Patel',
        initials: 'RP',
        avatarColor: '#f78166',
        role: 'Mechanical Engineer',
        timestamp: 'Yesterday 11:02 AM',
        text: "Vibration test at 12G failed. Crack propagated from the lower mounting boss on the chassis — right at the PCB standoff interface. Failure is localized but I'm going to need to redesign the boss geometry.",
      },
      {
        id: 'msg-008',
        author: 'Alex Chen',
        initials: 'AC',
        avatarColor: '#3fb950',
        role: 'Electrical Engineer',
        timestamp: 'Yesterday 11:18 AM',
        text: "If the standoff geometry changes, that affects our thermal pad placement and potentially the screw pattern. We should sync before you finalize the redesign.",
      },
      {
        id: 'msg-009',
        author: 'Raj Patel',
        initials: 'RP',
        avatarColor: '#f78166',
        role: 'Mechanical Engineer',
        timestamp: 'Yesterday 11:24 AM',
        text: "Agreed. Screw pattern is probably changing. Let me sketch the new geometry and then we can sync — will ping you when I have something.",
      },
    ],
  },
  {
    id: 'thread-004',
    channel: '#program',
    channelDescription: 'Leadership needs a risk update by Friday — EM promised to send it and hasn\'t',
    channelColor: '#bc8cff',
    note: '⚠ Thread dropped — PM still waiting on EM follow-up',
    messages: [
      {
        id: 'msg-010',
        author: 'Diana Park',
        initials: 'DP',
        avatarColor: '#ff7b72',
        role: 'Product Manager',
        timestamp: 'Yesterday 4:00 PM',
        text: "DVT exit is still on the calendar for April 15. I need to send a status to leadership by Friday. Does anyone have risks to that date I should flag? Tagging @Chris Okafor to confirm.",
      },
      {
        id: 'msg-011',
        author: 'Chris Okafor',
        initials: 'CO',
        avatarColor: '#79c0ff',
        role: 'Engineering Manager',
        timestamp: 'Yesterday 4:12 PM',
        text: "Yeah, I have a few. Will put together a list tonight. There's the supplier situation that's probably the biggest one.",
      },
    ],
  },
  {
    id: 'thread-005',
    channel: '#firmware-integration',
    channelDescription: 'Most software is working but sensors are blocked — April 15 deadline is at risk',
    channelColor: '#f78166',
    messages: [
      {
        id: 'msg-012',
        author: 'Priya Sharma',
        initials: 'PS',
        avatarColor: '#bc8cff',
        role: 'Firmware Engineer',
        timestamp: 'Today 8:05 AM',
        text: "Integration status update: CAN stack is up, motor controller comms verified. Still blocked on IMU and sensor suite — waiting on the U7 rail. Once that's resolved we can complete sensor bring-up in about 2 days.",
      },
      {
        id: 'msg-013',
        author: 'Tom Nguyen',
        initials: 'TN',
        avatarColor: '#56d364',
        role: 'Systems Engineer',
        timestamp: 'Today 8:22 AM',
        text: "The April 15 DVT exit assumes sensor bring-up is complete by April 8. If U7 slips past today, we'll need to compress or slip the integration test window.",
      },
    ],
  },
]

// ─── Extracted Signals (Program Context Layer) ────────────────────────────────

export const SIGNALS = [
  {
    id: 'sig-001',
    type: 'blocker',
    title: 'U7 Rail Bring-Up: 0V at TP23 — No Resolution in 18 Hours',
    summary:
      'Power rail TP23 reads 0V. Likely DNP resistor R112 or layout short near U7 switcher. EE assigned but no update posted. Firmware team blocked on IMU and sensor bring-up.',
    subsystem: 'PCB',
    sourceChannel: '#evb-bring-up',
    sourceThreadId: 'thread-002',
    actors: ['Alex Chen', 'Priya Sharma'],
    actorInitials: [['AC', '#3fb950'], ['PS', '#bc8cff']],
    owningTeam: 'Electrical',
    downstreamTeams: ['Firmware', 'Systems', 'Program'],
    resolutionStatus: 'open',
    hoursOld: 18,
    urgencyMultiplier: 1.4,
    impactChain: [
      { label: 'U7 Rail Blocked', type: 'blocker', owner: 'Alex Chen · EE' },
      { label: 'IMU / Sensor Bring-up Stalled', type: 'dependency', owner: 'Priya Sharma · FW' },
      { label: 'Firmware Integration Delayed', type: 'risk', owner: 'Firmware Team' },
      { label: 'DVT Exit Risk (+3–5 days)', type: 'milestone', owner: 'Program' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'You are the assigned owner. R112 is the suspected culprit. Firmware is blocked — resolution is needed before EOD to prevent integration slip. No update has been posted for 18 hours.',
      'Mechanical Engineer':
        'No direct impact on your work. If a hardware workaround is applied (rework, bodge wire), it may affect board mounting clearance — monitor.',
      'Supply Chain':
        'No direct impact. If a hardware fix requires component changes, monitor for new BOM entries that may need sourcing.',
      'Engineering Manager':
        'Open blocker with no update for 18 hours. Firmware integration is stalled. This is on the critical path to April 15 DVT exit. Escalation may be needed to unlock Alex.',
      'Product Manager':
        'Firmware integration is blocked. If U7 is not resolved today, DVT exit date (April 15) is at risk by ~3–5 days. This is the single most urgent item in the program.',
    },
  },
  {
    id: 'sig-002',
    type: 'risk',
    title: 'Murata Cap Delay: 14-Week Lead Time, No Approved Alternate',
    summary:
      'C47 (100µF bulk cap, power board) lead time extended from 8 to 14 weeks. TDK alternate proposed but not on AVL. Engineering approval pending for 12+ hours. DVT PO cannot be placed without resolution.',
    subsystem: 'Power Board',
    sourceChannel: '#supply-chain',
    sourceThreadId: 'thread-001',
    actors: ['Sarah Kim', 'James Wu', 'Alex Chen'],
    actorInitials: [['SK', '#f0a500'], ['JW', '#58a6ff'], ['AC', '#3fb950']],
    owningTeam: 'Supply Chain',
    downstreamTeams: ['Electrical', 'Firmware', 'Program'],
    resolutionStatus: 'open',
    hoursOld: 20,
    urgencyMultiplier: 1.3,
    impactChain: [
      { label: 'Murata Delivery Slipped (14 wks)', type: 'blocker', owner: 'Sarah Kim · SC' },
      { label: 'TDK Alternate Awaiting EE Approval', type: 'open_question', owner: 'Alex Chen · EE' },
      { label: 'DVT Power Board Build Blocked', type: 'risk', owner: 'Supply Chain' },
      { label: 'Board Spin / DVT Exit Delayed', type: 'milestone', owner: 'Program' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'You have been tagged to approve the TDK alternate (GRM31CR61C107KA01L). No response for 12 hours. Review the TDK spec sheet and sign off — SC cannot place the DVT PO without your approval.',
      'Mechanical Engineer':
        'No direct impact. If the TDK part has different physical dimensions, board layout changes could affect standoff placement — unlikely but monitor.',
      'Supply Chain':
        'This is your primary open action. PO cannot be placed without an approved alternate. You own escalation if EE has not responded by EOD. TDK stock is available but AVL approval is the gate.',
      'Engineering Manager':
        'Supplier slip on a key power component with no qualified alternate. EE approval has been requested but not received for 12 hours. If not resolved today, DVT build quantities are at risk.',
      'Product Manager':
        'Supplier delay on the power board. If alternate approval and PO placement do not happen this week, DVT build slips — downstream risk to April 15 exit date.',
    },
  },
  {
    id: 'sig-003',
    type: 'decision',
    title: 'Chassis Mounting Boss Redesign — Screw Pattern Change Expected',
    summary:
      'Vibration test at 12G caused crack at lower mounting boss (PCB standoff interface). ME will redesign boss geometry, likely changing PCB screw pattern and standoff placement. EE flagged thermal pad conflict. Sync not scheduled.',
    subsystem: 'Chassis / PCB Interface',
    sourceChannel: '#dvt-testing',
    sourceThreadId: 'thread-003',
    actors: ['Raj Patel', 'Alex Chen'],
    actorInitials: [['RP', '#f78166'], ['AC', '#3fb950']],
    owningTeam: 'Mechanical',
    downstreamTeams: ['Electrical', 'Manufacturing'],
    resolutionStatus: 'open',
    hoursOld: 22,
    urgencyMultiplier: 1.0,
    impactChain: [
      { label: 'Vibration Failure at 12G', type: 'blocker', owner: 'Raj Patel · ME' },
      { label: 'Mounting Boss Redesign', type: 'decision', owner: 'Raj Patel · ME' },
      { label: 'Screw Pattern + Thermal Pad Change', type: 'risk', owner: 'Alex Chen · EE' },
      { label: 'Potential Board Layout Revision', type: 'risk', owner: 'Electrical Team' },
      { label: 'DVT Board Spin Risk', type: 'milestone', owner: 'Program' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'The chassis redesign may force a screw pattern change and thermal pad relocation on your board. You flagged this in the thread but no sync has been scheduled. Board layout could be affected before the next spin.',
      'Mechanical Engineer':
        'You own this. Boss redesign is needed to pass vibration at 12G. Sync with EE before finalizing the new geometry to avoid a second round of changes from layout conflicts.',
      'Supply Chain':
        'Monitor for new hardware entries from the ME redesign (fasteners, standoffs, inserts). These may require sourcing if they are not already on the BOM.',
      'Engineering Manager':
        'Cross-team interface change in DVT. ME and EE need a sync. If this drives a layout revision, it could affect the board spin schedule. Consider initiating a change order.',
      'Product Manager':
        'Physical interface change in DVT. If it drives a board layout revision, the DVT board spin may slip — assess impact on the April 15 exit date.',
    },
  },
  {
    id: 'sig-004',
    type: 'open_question',
    title: 'DVT Risk Register Not Sent — PM Waiting on EM for Board Update',
    summary:
      'PM requested a risk list for a leadership board update due Friday. EM committed to sending it but no follow-up posted. Thread dropped 22 hours ago. At least 3 active program risks have no leadership visibility.',
    subsystem: 'Program',
    sourceChannel: '#program',
    sourceThreadId: 'thread-004',
    actors: ['Diana Park', 'Chris Okafor'],
    actorInitials: [['DP', '#ff7b72'], ['CO', '#79c0ff']],
    owningTeam: 'Engineering Management',
    downstreamTeams: ['Product', 'Leadership'],
    resolutionStatus: 'open',
    hoursOld: 22,
    urgencyMultiplier: 1.1,
    impactChain: [
      { label: 'EM Risk List Not Sent', type: 'open_question', owner: 'Chris Okafor · EM' },
      { label: 'PM Board Update Incomplete', type: 'risk', owner: 'Diana Park · PM' },
      { label: 'Leadership Blind to DVT Risks', type: 'risk', owner: 'Program' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'Your open items (U7 blocker, supplier alternate approval) are part of the unpublished risk register. No immediate action required, but they will surface in the leadership update.',
      'Mechanical Engineer':
        'The chassis vibration failure should appear on the leadership risk list. Confirm with EM that it is included.',
      'Supply Chain':
        'The Murata supplier slip is a program risk that should be in the board update. Confirm with EM that procurement has provided the correct lead time data.',
      'Engineering Manager':
        'You committed to this list and it has not been sent. PM is blocked on the board update due Friday. At least 3 open risks (supplier slip, U7 blocker, chassis redesign) have no leadership visibility.',
      'Product Manager':
        'You are blocked on the board update. The risk list has not arrived. Either follow up with EM directly or compile the risk register from available program signals.',
    },
  },
  {
    id: 'sig-005',
    type: 'milestone_update',
    title: 'Firmware Integration: April 8 Sensor Deadline Gates April 15 DVT Exit',
    summary:
      'CAN stack and motor controller comms verified. IMU and sensor suite blocked on U7 rail. Systems team confirmed April 15 DVT exit requires sensor bring-up by April 8. If U7 slips past today, integration test window must compress or slip.',
    subsystem: 'Firmware / Sensors',
    sourceChannel: '#firmware-integration',
    sourceThreadId: 'thread-005',
    actors: ['Priya Sharma', 'Tom Nguyen'],
    actorInitials: [['PS', '#bc8cff'], ['TN', '#56d364']],
    owningTeam: 'Firmware',
    downstreamTeams: ['Systems', 'Program'],
    resolutionStatus: 'open',
    hoursOld: 2,
    urgencyMultiplier: 1.2,
    impactChain: [
      { label: 'Sensor Bring-up Blocked (U7)', type: 'blocker', owner: 'Firmware Team' },
      { label: 'April 8 Integration Deadline at Risk', type: 'milestone', owner: 'Systems' },
      { label: 'DVT Exit Slips (April 15+)', type: 'milestone', owner: 'Program' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'Firmware just published a hard deadline dependency: sensor bring-up must complete by April 8 for DVT exit on April 15. Your U7 fix is now on a 6-day clock.',
      'Mechanical Engineer':
        'No direct impact. Monitor for cascading milestone changes if DVT exit slips.',
      'Supply Chain':
        'A DVT exit slip would affect the PVT build schedule and procurement timing. If April 15 moves, your order placement dates shift accordingly.',
      'Engineering Manager':
        'Systems team has made the April 15 date dependency explicit: sensor bring-up must be done by April 8. U7 is the gate. This is the clearest articulation of schedule risk in the program.',
      'Product Manager':
        'This message confirms the critical path: U7 fix → sensor bring-up (2 days) → integration testing → DVT exit (April 15). If U7 is not resolved today, April 15 is no longer realistic.',
    },
  },
  {
    id: 'sig-006',
    type: 'dependency',
    title: 'EE → Firmware Hard Dependency: U7 Rail Gates All Sensor Init',
    summary:
      'Firmware sensor initialization has a hard dependency on U7 3.3V rail. Once the rail is confirmed live, firmware team needs ~2 days to complete sensor bring-up. Dependency is active and blocking integration.',
    subsystem: 'PCB / Firmware',
    sourceChannel: '#firmware-integration',
    sourceThreadId: 'thread-005',
    actors: ['Alex Chen', 'Priya Sharma'],
    actorInitials: [['AC', '#3fb950'], ['PS', '#bc8cff']],
    owningTeam: 'Electrical',
    downstreamTeams: ['Firmware'],
    resolutionStatus: 'open',
    hoursOld: 2,
    urgencyMultiplier: 1.0,
    impactChain: [
      { label: 'U7 Rail Fix Required (EE)', type: 'blocker', owner: 'Alex Chen · EE' },
      { label: '2-Day Sensor Bring-up Window', type: 'dependency', owner: 'Priya Sharma · FW' },
      { label: 'Integration Testing Can Begin', type: 'decision', owner: 'Firmware Team' },
    ],
    whyItMatters: {
      'Electrical Engineer':
        'Firmware is counting on a 2-day window from the moment you fix U7. Every hour of delay compresses their schedule. Communicate any ETA as soon as you have one.',
      'Mechanical Engineer':
        'No direct impact. No action required.',
      'Supply Chain':
        'No direct impact. Monitor for downstream schedule changes.',
      'Engineering Manager':
        'This dependency is now explicit and documented. The critical path to April 15 runs through U7 resolution → 2 days firmware → integration test. Manage accordingly.',
      'Product Manager':
        'The critical path to April 15 is: U7 fix → 2 days sensor bring-up → integration test → DVT exit. The clock started the moment this dependency was published.',
    },
  },
]

// ─── Roles ───────────────────────────────────────────────────────────────────

export const ROLES = [
  { id: 'Electrical Engineer', label: 'Electrical Engineer', color: '#3fb950' },
  { id: 'Mechanical Engineer', label: 'Mechanical Engineer', color: '#f78166' },
  { id: 'Supply Chain', label: 'Supply Chain', color: '#f0a500' },
  { id: 'Engineering Manager', label: 'Engineering Manager', color: '#79c0ff' },
  { id: 'Product Manager', label: 'Product Manager', color: '#bc8cff' },
]

// ─── Phases ──────────────────────────────────────────────────────────────────

export const PHASES = [
  { id: 'Prototype', label: 'Prototype', sublabel: 'first rough build' },
  { id: 'EVT', label: 'EVT', sublabel: 'does it work?' },
  { id: 'DVT', label: 'DVT', sublabel: 'does it meet spec?' },
  { id: 'PVT', label: 'PVT', sublabel: 'ready to manufacture?' },
]

// ─── Signal type metadata ─────────────────────────────────────────────────────

export const SIGNAL_META = {
  blocker:          { label: 'Blocker',       sublabel: 'work is stopped',               color: '#f85149' },
  risk:             { label: 'Risk',          sublabel: 'could go wrong',                color: '#d29922' },
  decision:         { label: 'Decision',      sublabel: 'choice needs to be made',       color: '#bc8cff' },
  open_question:    { label: 'Open Question', sublabel: 'asked, not answered',           color: '#58a6ff' },
  milestone_update: { label: 'Milestone',     sublabel: 'deadline changed',              color: '#f0883e' },
  dependency:       { label: 'Dependency',    sublabel: 'one team waiting on another',   color: '#58a6ff' },
}
