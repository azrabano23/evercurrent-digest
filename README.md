# EverCurrent Digest

A personalized daily digest tool for hardware engineering teams. Built as a take-home for EverCurrent.

---

## The Problem

Slack works. But when you have 5 different jobs on one team — mechanical engineer, electrical engineer, supply chain, engineering manager, product manager — everyone is reading the same threads and trying to figure out what matters to *them*.

A firmware blocker is critical to the EE and invisible to supply chain. A supplier lead time slip is urgent to supply chain and background noise to the ME. And none of that is static — what matters in DVT is different from what mattered in Prototype.

The result: important things get buried, people miss what they needed to see, and the team gets out of sync.

---

## What This Does

It reads Slack threads, figures out what matters most for each person, and shows them a ranked list — personalized to their role and the current project phase.

Think of it like a news feed that knows you're an electrical engineer in DVT, not a product manager in Prototype. Same threads, completely different digest.

---

## How It Works

### Step 1 — Read the raw Slack threads
The left panel shows 5 real threads from a hardware team in DVT. Things like a power rail that won't come up, a supplier pushing lead times, a chassis that cracked under vibration testing.

These are unfiltered. No ranking. No signal extraction. Just the raw conversation.

### Step 2 — Pull out what matters from each thread
Each thread gets turned into a typed signal:

| Type | What it means |
|------|---------------|
| Blocker | someone can't move forward |
| Risk | nothing is stuck yet, but something could go wrong |
| Decision | a choice needs to be made — delay has a cost |
| Open Question | something was asked and nobody answered |
| Milestone Update | a deadline changed |
| Dependency | one team is waiting on another team's output |

Each signal also gets tagged with who owns it, which subsystem it's in, which teams are downstream, and how old it is.

### Step 3 — Score the signal for the person reading it

Every signal gets a score. Higher score = more important to read right now.

```
score = role weight × phase weight × recency × urgency × ownership boost × reach
```

**Role weight** — how much does this role actually care about this signal type?

| Signal | EE | ME | Supply Chain | Eng Manager | PM |
|--------|----|----|--------------|-------------|-----|
| Blocker | 0.95 | 0.82 | 0.68 | 0.95 | 0.72 |
| Risk | 0.78 | 0.78 | 0.92 | 0.95 | 0.88 |
| Milestone | 0.60 | 0.52 | 0.78 | 0.90 | 0.95 |
| Dependency | 0.92 | 0.70 | 0.60 | 0.80 | 0.58 |

Supply chain cares most about risk and milestones. EEs care most about blockers and dependencies. PMs care most about schedule. These aren't guesses — they're what each job actually does.

**Phase weight** — the same signal is more or less urgent depending on where the project is.

| Signal | Prototype | EVT | DVT | PVT |
|--------|-----------|-----|-----|-----|
| Blocker | 1.20 | 1.42 | 1.30 | 1.50 |
| Risk | 0.55 | 0.88 | 1.22 | 1.45 |
| Open Question | 1.30 | 1.10 | 1.05 | 1.50 |
| Milestone | 0.45 | 0.78 | 1.12 | 1.42 |

In Prototype, risk is expected. Nobody panics. In PVT, risk is a potential launch blocker. The same supplier delay that was a MEDIUM in EVT is a CRITICAL in PVT — without touching a single line of the signal data.

**Recency** — newer signals score higher. Uses a slow exponential decay (`1 / (1 + 0.035t)`) because hardware teams operate on day-scale cycles, not hour-scale.

**Urgency** — some signals get manually flagged as time-sensitive (e.g. "if EE doesn't approve the alternate part in 2 days, the DVT PO can't be placed").

**Ownership boost** — if the signal is about something you directly own, score ×1.85. If your team is downstream of it, score ×1.45. An EE doesn't need a supply chain thread ranked the same as a blocker in their own board.

**Cross-functional reach** — each additional downstream team adds 18% to the score. A problem affecting firmware + systems + program is more important to a manager than one contained in a single discipline.

### Step 4 — Rank and show the top 5

Sort by score, take the top 5, group by CRITICAL / HIGH / MEDIUM / LOW.

The cutoffs are tuned so you see 1–2 criticals in DVT at most. If everything is critical, nothing is.

### Step 5 — Explain it in terms that are actually useful

Each signal has a different explanation written for each role. The same U7 power rail blocker looks like this:

**To the EE:** "You are the assigned owner. R112 is the suspected culprit. Firmware is blocked — resolution needed before EOD. No update posted for 18 hours."

**To the PM:** "If this isn't fixed today, DVT exit on April 15 slips 3–5 days. This is the single most urgent item in the program."

**To supply chain:** "No direct impact. If a hardware fix requires component changes, monitor for new BOM entries."

Same signal. Different framing. Each person gets exactly what they need to act.

---

## What Adapts As the Phase Changes

Switch the phase in the header — the entire digest re-ranks in real time.

- **Prototype** → decisions and open questions bubble up, supply chain noise is suppressed
- **EVT** → blockers and dependencies get amplified
- **DVT** → risk and supply chain urgency are elevated, spec changes are flagged
- **PVT** → everything tightens, any open question becomes critical

---

## UI Layout

```
┌──────────────────────────────────────────────────────────────┐
│  EverCurrent / Daily Digest    [Role ▾]   [Prototype EVT DVT PVT]  │
├─────────────────┬────────────────────────────────────────────┤
│  SLACK THREADS  │  [Role] · [Phase]           2 critical     │
│                 │  ─────────────────────────────────────     │
│  #supply-chain  │  CRITICAL · 2                              │
│  Sarah Kim …    │  ┌─────────────────────────────────────┐  │
│  James Wu …     │  │ • U7 Rail: 0V at TP23 — 18hrs open  │  │
│                 │  │   Blocker · #evb-bring-up · 18h ago  │  │
│  #evb-bring-up  │  └─────────────────────────────────────┘  │
│  ⚠ 18h no reply │                                            │
│  Alex Chen …    │  HIGH · 1                                  │
│  Priya Sharma … │  ┌─────────────────────────────────────┐  │
│                 │  │ • Murata Cap: 14-week lead time      │  │
│  #dvt-testing   │  │   Risk · #supply-chain · 20h ago     │  │
│  Raj Patel …    │  └─────────────────────────────────────┘  │
└─────────────────┴────────────────────────────────────────────┘
```

Click any digest card → see why it matters to you, the domino chain downstream, and the full score breakdown.

---

## Production Architecture (Beyond the Prototype)

In production, the signal extraction layer (currently hand-written mock data) would be replaced with:

1. **Slack Events API** — bot subscribes to message events across all channels
2. **LLM classification** — each thread is passed to a language model with a structured prompt; output is JSON: `{ type, title, summary, subsystem, owningTeam, downstreamTeams, urgencyMultiplier, actors }`
3. **Signal store** — lightweight database (Postgres) persists signals; recency computed at query time
4. **Scoring service** — stateless function, accepts `{ role, phase }`, returns ranked digest; callable from Slack bot, email, or web
5. **Delivery** — Slack DM at 8am, or on-demand via `/digest` slash command
6. **Feedback loop** — users can mark items "not relevant"; votes update role weights over time (online learning on the personalization model)

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Pick a role and phase. The digest re-ranks instantly.

---

## Stack

React 18 + Vite. No backend, no database. All scoring runs client-side on mock data representing a real DVT-phase program.
