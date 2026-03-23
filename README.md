# EverCurrent Digest

**Daily Digest Tool for Hardware Engineering Teams**

A working prototype that surfaces the most relevant information from Slack for each role on a robotics hardware team — and re-ranks that information as the project phase changes.

---

## The Problem

Slack works for real-time collaboration but fails as a source of truth. On a hardware team spanning mechanical engineers, electrical engineers, supply chain, firmware, and program — each role has a fundamentally different priority structure. A milestone update is critical to a PM; it barely registers for an EE deep in bring-up. A supplier lead time slip is the most urgent thing in the program to supply chain; it shows up nowhere in an EE's feed. Important signals get buried in thread noise, and every role ends up under-informed about the things that matter most to them specifically.

The secondary problem is that what matters changes. The same signal that is low-priority during Prototype is a program blocker in PVT. A scoring system that is static across phases will either over-alert early (noise) or under-alert late (risk).

---

## The Solution

EverCurrent Digest ingests raw Slack threads, extracts structured signals from them, and generates a personalized, ranked digest for each role and project phase. The digest surfaces only what is most relevant to that person — with a plain-language explanation of *why it matters to them specifically* and a visual chain showing how that signal propagates through the program.

---

## Architecture and Data Flow

```
Slack Threads (raw)
        │
        ▼
Signal Extraction Layer
  ─ Classify each thread into typed signals:
    blocker / risk / decision / open_question / milestone_update / dependency
  ─ Tag subsystem, owning team, downstream teams, actors, recency
        │
        ▼
Scoring Engine  ←── Role selected by user
  score = R_w × P_w × recency × urgency × dep_impact × cf_reach
  ─ R_w: how much this role cares about this signal type
  ─ P_w: how much this project phase amplifies this signal type
  ─ recency: slow exponential decay (hardware moves slower than software)
  ─ urgency: signal-level multiplier for time-sensitive items
  ─ dep_impact: 1.85× if the signal touches a subsystem this role owns
  ─ cf_reach: scales with number of downstream teams affected
        │
        ▼
Ranked Digest (top 5 signals for this role × phase)
  ─ Priority tier: CRITICAL / HIGH / MEDIUM / LOW
  ─ Role-specific explanation: "why this matters *to you*"
  ─ Impact chain: how this signal propagates downstream
        │
        ▼
UI: Three-panel layout
  ─ Left: raw Slack threads (source of truth, readable in full)
  ─ Right: personalized digest cards (what to act on today)
  ─ Click any digest card → jump to the originating thread
```

---

## Personalization Model

### Role Weights

Each role has a weight (0–1) for each signal type, encoding what that role structurally cares about:

| Signal Type      | EE   | ME   | Supply Chain | Eng Manager | PM   |
|------------------|------|------|--------------|-------------|------|
| Blocker          | 0.95 | 0.82 | 0.68         | 0.95        | 0.72 |
| Risk             | 0.78 | 0.78 | 0.92         | 0.95        | 0.88 |
| Decision         | 0.82 | 0.90 | 0.72         | 0.88        | 0.68 |
| Open Question    | 0.68 | 0.62 | 0.82         | 0.95        | 0.85 |
| Milestone Update | 0.60 | 0.52 | 0.78         | 0.90        | 0.95 |
| Dependency       | 0.92 | 0.70 | 0.60         | 0.80        | 0.58 |

Supply chain cares most about risk and open questions (procurement gates). EEs care most about blockers and dependencies (their work is technically blocked or blocking others). PMs care most about milestone updates and risk. Engineering managers are high across everything — they need full program visibility.

### Phase Weights

The same signal is amplified or dampened depending on where the team is in the hardware development cycle:

| Signal Type      | Prototype | EVT  | DVT  | PVT  |
|------------------|-----------|------|------|------|
| Blocker          | 1.20      | 1.42 | 1.30 | 1.50 |
| Risk             | 0.55      | 0.88 | 1.22 | 1.45 |
| Decision         | 1.45      | 1.18 | 1.00 | 1.35 |
| Open Question    | 1.30      | 1.10 | 1.05 | 1.50 |
| Milestone Update | 0.45      | 0.78 | 1.12 | 1.42 |
| Dependency       | 0.75      | 1.20 | 1.10 | 1.25 |

In Prototype, decisions and open questions are amplified — the team needs to make fast choices. Risk is tolerated. In PVT, everything tightens: blockers and open questions at 1.5× because any unresolved item can delay launch. This means the same supplier risk that scored MEDIUM in Prototype scores CRITICAL in PVT without any change to the underlying signal.

### Dependency Impact

A signal that touches a subsystem a role directly owns scores 1.85× higher than a generic cross-team signal. A signal whose downstream teams include the role's area scores 1.45×. This ensures that an EE sees their own bring-up blocker ranked first, not buried behind a program-level update they are already aware of.

### Cross-functional Reach

Signals that propagate across more downstream teams score higher. A blocker with 3 downstream teams affected is more urgent to a manager than a blocker contained within a single discipline.

### Recency Decay

Score scales as `1 / (1 + 0.035 × hoursOld)`. The 0.035 constant is intentionally slow — hardware teams operate on day-scale cycles, not hour-scale. A signal from 24 hours ago is still fully relevant; one from a week ago begins to fade.

---

## Signal Types

| Type             | Definition                                                        |
|------------------|-------------------------------------------------------------------|
| Blocker          | Work is stopped. Someone cannot proceed without resolution.        |
| Risk             | No one is blocked yet, but timeline or quality is at risk.        |
| Decision         | A choice needs to be made. Delay has a cost.                      |
| Open Question    | Something has been asked and not yet answered.                    |
| Milestone Update | Status of a gate or deadline has changed.                         |
| Dependency       | One team's progress is gated on another team's output.            |

---

## Example: Same Slack Thread, Different Digests

The U7 power rail bring-up thread produces different digest entries depending on who is reading:

**Electrical Engineer (DVT):** CRITICAL — "You are the assigned owner. R112 is the suspected culprit. Firmware is blocked — resolution needed before EOD. No update posted for 18 hours."

**Product Manager (DVT):** CRITICAL — "Firmware integration is blocked. If U7 is not resolved today, DVT exit date (April 15) is at risk by ~3–5 days. This is the most urgent item in the program."

**Supply Chain (DVT):** MEDIUM — "No direct impact. If a hardware fix requires component changes, monitor for new BOM entries that may need sourcing."

Same signal. Three different digests. Each person gets the framing that is actionable for them.

---

## How Priorities Adapt Across Phases

| Phase     | U7 Blocker (EE) Score | Murata Risk (SC) Score | Chassis Decision (ME) Score |
|-----------|-----------------------|------------------------|-----------------------------|
| Prototype | 1.12 → HIGH           | 0.61 → MEDIUM          | 0.74 → MEDIUM               |
| EVT       | 1.89 → CRITICAL       | 0.95 → MEDIUM          | 1.22 → HIGH                 |
| DVT       | 2.14 → CRITICAL       | 1.38 → HIGH            | 1.45 → HIGH                 |
| PVT       | 2.86 → CRITICAL       | 2.01 → CRITICAL        | 1.68 → HIGH                 |

The same signals, scored at four phases. The team's focus naturally tightens as they approach launch.

---

## Production Architecture (Beyond Prototype)

In a real deployment, the signal extraction layer would be replaced by:

1. **Slack Events API** — subscribe to message and reaction events; ingest all channels the bot is invited to
2. **LLM Classification Step** — an LLM (e.g. Claude) reads each thread and outputs structured JSON: `{ type, title, summary, subsystem, owningTeam, downstreamTeams, urgencyMultiplier, actors }`
3. **Signal Store** — a lightweight database (Postgres or similar) stores extracted signals with timestamps; recency is computed at query time
4. **Digest API** — a service accepts `{ role, phase }` and returns top-N scored signals; callable from Slack bot, email, or web UI
5. **Delivery** — Slack DM at 8am daily, or on-demand via `/digest` slash command; the web prototype serves as a management view and configuration tool
6. **Feedback Loop** — users can mark a digest item as "not relevant"; these votes adjust role weights over time (online learning on the personalization model)

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Select a role and project phase in the header. The digest re-ranks in real time. Click any digest card to read the originating Slack thread.

---

## Stack

- React 18 + Vite
- Pure CSS (no component library)
- No backend — all scoring runs client-side
- Mock data simulates a real DVT-phase program with 5 Slack threads and 6 extracted signals
