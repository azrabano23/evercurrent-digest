# EverCurrent Digest

A personalized daily digest tool for hardware engineering teams. Built as a response to the EverCurrent take-home.

---

## The One-Line Version

Same Slack threads. Completely different digest depending on who you are and where the project is.

---

## The Problem

Slack works great for real-time conversation. It's terrible as a source of truth.

On a hardware team — mechanical engineers, electrical engineers, supply chain, engineering managers, product managers — everyone is reading the same channels but needs completely different information. A firmware blocker is the most urgent thing in the program for the EE and basically invisible to supply chain. A supplier lead time slip is supply chain's whole world and background noise for an ME.

And none of that is static. What matters in DVT is completely different from what mattered in Prototype. The same signal that's a "monitor and note" in EVT is a potential launch blocker in PVT.

The result: important things get buried in threads, roles get out of sync, and the team loses execution velocity — not because people aren't working, but because they're working off incomplete information.

---

## What This Builds

A daily digest that:
1. Reads Slack threads and pulls out what actually matters
2. Scores each signal for your specific role and project phase
3. Shows you a ranked list — with a plain-language explanation of why each item matters *to you*
4. Re-ranks everything in real time as the project phase changes

---

## Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EVERCURRENT DIGEST — DATA FLOW                      │
└─────────────────────────────────────────────────────────────────────────────┘

  INPUTS                    PROCESSING                        OUTPUT
  ──────                    ──────────                        ──────

  Slack Channels            Signal Extraction                 Personalized Digest
  ┌─────────────┐           ┌────────────────────────┐        ┌─────────────────┐
  │ #supply-    │ ────────▶ │ Classify thread into   │        │ CRITICAL        │
  │  chain      │           │ typed signal:           │        │ ┌─────────────┐ │
  │             │           │  blocker / risk /       │        │ │ U7 Rail     │ │
  │ #evb-bring- │ ────────▶ │  decision /             │        │ │ 0V at TP23  │ │
  │  up         │           │  open_question /        │        │ └─────────────┘ │
  │             │           │  milestone_update /     │        │                 │
  │ #dvt-       │ ────────▶ │  dependency             │        │ HIGH            │
  │  testing    │           │                         │        │ ┌─────────────┐ │
  │             │           │ Tag each signal with:   │        │ │ Murata Cap  │ │
  │ #program    │ ────────▶ │  subsystem, owning team,│        │ │ 14-wk delay │ │
  │             │           │  downstream teams,      │        │ └─────────────┘ │
  │ #firmware-  │ ────────▶ │  actors, hoursOld       │        └─────────────────┘
  │  integration│           └────────────┬───────────┘               ▲
  └─────────────┘                        │                            │
                                         ▼                            │
                             ┌───────────────────────┐               │
                             │     Scoring Engine     │ ──────────────┘
                             │                        │
  PERSONALIZATION             │  score =               │
  LAYER                      │   role_weight          │
  ┌─────────────┐            │   × phase_weight       │
  │ Role        │ ─────────▶ │   × recency            │
  │ (who reads) │            │   × urgency            │
  └─────────────┘            │   × ownership_boost    │
  ┌─────────────┐            │   × cf_reach           │
  │ Phase       │ ─────────▶ │                        │
  │ (where the  │            │  → sort descending     │
  │  project is)│            │  → top 5               │
  └─────────────┘            │  → attach role-        │
                             │    specific explanation │
                             └───────────────────────┘

  ROLE WEIGHTS (0–1)          PHASE MULTIPLIERS (0.5–1.5)
  ─────────────────           ────────────────────────────
  EE   → blockers,            Prototype → decisions high,
         dependencies                risk suppressed
  PM   → milestones, risk     PVT      → everything high,
  SC   → risk,                         no open items allowed
         open questions
  EM   → everything high
```

---

## The Scenario (What the Mock Data Is Actually About)

The prototype is built around a real-feeling scenario: a robotics hardware team in DVT. Here's what's happening in plain English.

**The team** — five people working on a robot:
- **Alex Chen** (Electrical Engineer) — owns the circuit board
- **Raj Patel** (Mechanical Engineer) — owns the physical chassis
- **Sarah Kim + James Wu** (Supply Chain) — manage parts orders
- **Priya Sharma** (Firmware Engineer) — writing the software that runs on the board
- **Chris Okafor** (Engineering Manager) — responsible for the overall program
- **Diana Park** (Product Manager) — owns the timeline and leadership updates

**What's going wrong this week:**

**1. The circuit board has a dead power rail** (`#evb-bring-up`)
One section of the board is reading 0 volts when it should be 3.3 volts. Something is wired wrong — probably a tiny resistor that was accidentally left off. Alex thinks he knows which one (R112) but hasn't confirmed or fixed it yet. Priya's firmware team can't test the sensors at all until that power comes back on. The thread has been open 18 hours with no update.

**2. A key part won't arrive in time** (`#supply-chain`)
A capacitor (C47 — a tiny electrical component that stabilizes power) was ordered from Murata. The supplier just pushed the delivery from 8 weeks to 14 weeks. It won't arrive before the DVT build. There's an equivalent part from TDK that could work, but it's not on the approved list yet — Alex has to sign off on it. He hasn't responded in 12 hours. If he doesn't approve it this week, supply chain can't place the order.

**3. The chassis cracked during a shake test** (`#dvt-testing`)
They tested how the robot handles vibration (like being dropped or running on rough terrain). It failed — the chassis cracked right where the circuit board screws in. Raj needs to redesign that area, but if he changes the screw pattern, it affects where Alex's board mounts. They need to sync before either one finalizes anything. That sync hasn't happened.

**4. Leadership doesn't know any of this** (`#program`)
The PM (Diana) needs to send a risk update to leadership by Friday. She asked the EM (Chris) to send her the list of open risks. He said he would. He never did. The thread dropped 22 hours ago. At least three big program risks have no leadership visibility.

**5. The April 15 deadline is in danger** (`#firmware-integration`)
Priya's team published an update: the CAN bus and motor controller are working. But everything sensor-related is blocked on the dead power rail. She needs the rail fixed today — then 2 more days to finish sensor bring-up — then the integration test window. If the rail slips even one day, April 15 is no longer realistic.

**The thread running through everything:** the dead power rail (thread 2) is the single most important thing in the program. Fixing it unblocks firmware, which is the gate to DVT exit, which is what the PM is trying to report on. That's the kind of hidden critical path that gets lost in Slack — and exactly what this tool is designed to surface.

---

## How It Works — Step by Step

### Step 1 — Start with the raw Slack threads

The left panel shows 5 real threads from a hardware team in DVT: a power rail that won't come up, a supplier pushing lead times by 6 weeks, a chassis that cracked during vibration testing, a PM waiting on an EM for a risk register, and a firmware team blocked on sensor bring-up.

No filtering. No ranking. Just what people actually said.

### Step 2 — Extract typed signals from each thread

Each thread becomes a structured signal with a type:

| Type | Plain English |
|------|---------------|
| **Blocker** | someone can't move forward right now |
| **Risk** | nothing's stuck yet, but something could go wrong |
| **Decision** | a choice needs to be made — waiting has a cost |
| **Open Question** | something was asked and nobody answered |
| **Milestone Update** | a deadline changed |
| **Dependency** | one team's work is gated on another team |

Each signal also gets tagged with: who owns it, which subsystem it's in, which teams are downstream of it, how old it is, and how time-sensitive it is.

### Step 3 — Score the signal for the person reading it

Every signal gets a number. Higher = more important to you right now.

```
score = role_weight × phase_weight × recency × urgency × ownership_boost × cf_reach
```

**Role weight** — how much does this role actually care about this signal type?

| Signal | EE | ME | Supply Chain | Eng Manager | PM |
|--------|----|----|--------------|-------------|-----|
| Blocker | 0.95 | 0.82 | 0.68 | 0.95 | 0.72 |
| Risk | 0.78 | 0.78 | 0.92 | 0.95 | 0.88 |
| Milestone | 0.60 | 0.52 | 0.78 | 0.90 | 0.95 |
| Dependency | 0.92 | 0.70 | 0.60 | 0.80 | 0.58 |

Not guesses. These encode what each job actually does all day.

**Phase weight** — same signal, totally different urgency depending on where the project is.

| Signal | Prototype | EVT | DVT | PVT |
|--------|-----------|-----|-----|-----|
| Blocker | 1.20 | 1.42 | 1.30 | 1.50 |
| Risk | 0.55 | 0.88 | 1.22 | 1.45 |
| Open Question | 1.30 | 1.10 | 1.05 | 1.50 |
| Milestone | 0.45 | 0.78 | 1.12 | 1.42 |

In Prototype, risk is normal. In PVT, risk is a potential launch blocker. Same supplier delay, completely different score — without changing a single line of signal data.

**Recency** — newer = more important. Decay is slow (`1 / (1 + 0.035t)`) because hardware teams move on day-scale cycles, not hour-scale.

**Urgency** — signals can be flagged time-sensitive. E.g. "EE needs to approve this alternate part within 2 days or the DVT PO can't be placed."

**Ownership boost** — if the signal is about something you directly own: ×1.85. If your team is downstream of it: ×1.45. An EE shouldn't rank a supply chain thread the same as a blocker on their own board.

**Cross-functional reach** — every additional downstream team adds 18% to the score. A problem that hits firmware + systems + program matters more to a manager than one contained within a single discipline.

### Step 4 — Rank, group, show

Sort by score. Take the top 5. Group by CRITICAL / HIGH / MEDIUM / LOW. The thresholds are tuned so you see 1–2 criticals in DVT max. If everything is critical, the word means nothing.

### Step 5 — Tell each person why it matters to *them*

Same signal, totally different explanation per role. The U7 power rail blocker:

- **EE:** "You're the assigned owner. R112 is the suspected culprit. Firmware is blocked — resolution needed before EOD. No update in 18 hours."
- **PM:** "If this isn't fixed today, DVT exit on April 15 slips 3–5 days. Most urgent item in the program."
- **Supply Chain:** "No direct impact. If a hardware fix needs new parts, watch for new BOM entries."

Same signal. Three different framings. Each person gets exactly what they need to act.

---

## What Changes When You Switch Phases

Hit the phase buttons in the header. Watch the digest re-rank in real time.

- **Prototype** → decisions and open questions rise. Risk is suppressed. Nobody's sweating the schedule yet.
- **EVT** → blockers and dependencies amplify. Test failures show up first.
- **DVT** → supplier risk and spec changes become high priority. Integration milestones matter.
- **PVT** → everything tightens. Any open question is a potential launch blocker.

This is the core insight: the *same* signal means different things at different phases. The tool encodes that automatically.

---

## Tech Stack

### Prototype (what's built now)

| Layer | Technology | Why |
|-------|------------|-----|
| UI | React 18 + Vite | fast dev, no overhead, HMR makes iteration instant |
| Styling | Inline CSS | no class name indirection — easier to read and explain |
| Scoring | Pure JS, client-side | stateless function, runs instantly, no server needed |
| Data | Hand-written mock JSON | lets us prove the product concept before building infra |
| Deploy | GitHub | version-controlled, shareable |

No backend. No database. No API keys. Everything runs in the browser. This is intentional — the prototype exists to prove the *idea*, not the infrastructure.

### Production (what we'd build toward)

| Layer | Technology | Why |
|-------|------------|-----|
| Signal ingestion | Slack Events API | real-time stream of all channel messages |
| Signal extraction | LLM (Claude / GPT-4) with structured JSON output | fast, flexible classification without writing rules for every thread pattern |
| Signal store | PostgreSQL | persist signals, compute recency at query time, store feedback |
| Scoring service | Node.js or Python microservice | stateless, accepts `{ role, phase }`, returns ranked digest — can serve Slack bot + web + email from same endpoint |
| Delivery | Slack Bot (DM + `/digest` command) | meets users where they already are |
| Weight learning | Online learning on click/dismiss/save signals | weights drift toward what actually matters to each person over time |
| Auth | Slack OAuth | team members authenticate with their existing Slack identity |

The scoring engine doesn't change between prototype and production. The only difference is where the signals come from (hand-written vs LLM-extracted) and where the digest goes (browser vs Slack DM).

---

## Impact & ROI

### The core problem it solves

A hardware team in DVT typically has 10–20 Slack channels active at any time. An engineer who reads everything loses 30–60 minutes a day to noise. An engineer who doesn't read everything misses things that matter. The digest replaces that tradeoff with something better: read one thing in 2 minutes and know exactly what needs your attention.

### What the team gets

**Faster response on blockers.** Blockers that stay open because the right person never saw them are one of the biggest sources of schedule slip in hardware. The digest surfaces them directly to the person who can unblock them, with context.

**Earlier visibility into risk.** Supply chain risks, interface changes, and dependency conflicts are often visible in Slack days before they become formal program risks. The digest catches them while there's still time to act.

**Less meeting overhead.** A lot of stand-ups and syncs exist to redistribute information that got buried in Slack. If everyone already knows what matters, those meetings get shorter or go away.

**Cross-functional alignment without overhead.** The EM and PM see everything that crosses team boundaries. Individual contributors see only what's in their domain. Nobody gets buried in irrelevant noise, and nobody misses something that affects their work.

### Why it gets more valuable over time

The scoring model is initialized with expert heuristics, but it learns. Every time a user dismisses an item, saves it, clicks through to the thread, or rates it not relevant — that's a signal. Over time the weights drift toward what actually matters to each specific person on the team, not just their role archetype. The system gets more accurate as it's used.

### Rough ROI framing

If the tool saves each engineer 20 minutes per day of Slack triage, and a team has 10 engineers at an average fully-loaded cost of $200/hour:

```
10 engineers × 20 min/day × $200/hr = $667/day saved
= ~$167,000/year in recovered engineering time
```

That's just the time savings. The harder-to-quantify value is schedule risk reduction — a single blocker that gets surfaced one day earlier in DVT can easily be worth more than the entire year's tool cost.

---

## Common Questions

**"How are the weights chosen?"**

They're explicit heuristics right now — domain-informed defaults that encode what each role structurally cares about. I chose that on purpose because heuristics are interpretable. You can look at the table and immediately sanity-check whether supply chain should weight risk higher than an EE. You can't do that with a learned model.

In production I'd keep the heuristics as initialization and refine using behavioral feedback — what people click, dismiss, save, and rate. That turns it into an online learning problem where weights drift toward what actually matters to each specific person. But you don't start there. You'd have nothing to learn from.

**"How reliable is signal extraction?"**

In the prototype, signals are hand-written so extraction is perfect. In production with an LLM doing the classification, the key is graceful degradation. I'd constrain the output to a strict JSON schema, require a confidence score with every classification, and rank low-confidence signals lower rather than hiding them. Users can correct misclassifications — those corrections become training data.

Design principle: I'd rather degrade gracefully than overstate certainty. An LLM that confidently misclassifies is worse than one that says "not sure, here it is at LOW."

**"What makes this more than summarization?"**

Summarization tells you what happened. This tells you what matters to *you* right now — based on your role, what you own, who's downstream of you, and where the project is. Same thread, completely different output per person. That's not summarization. That's relevance routing.

**"Why a web UI and not Slack-native?"**

In production it would be Slack — daily DM at 8am and a `/digest` slash command. The web UI exists for the prototype because it makes the ranking logic easy to inspect. You can click a card, see the score breakdown, and switch roles to see how the same signal looks to a different person. That's hard to do in a Slack message. The scoring service underneath is identical either way.

---

## Live Demo Walkthrough

*(Use this during a live demo — follow this order)*

**1. Start on the left panel.** Point out 5 Slack threads. "This is what the team's Slack looks like. Raw, unfiltered, every role mixed together."

**2. Switch to Electrical Engineer, DVT.** "Here's what the tool surfaces for the EE in DVT. Two criticals. Both are things they can directly act on — the U7 power rail they own, and the alternate part they were tagged to approve."

**3. Click the U7 blocker card.** "Expand it. Three things: why it matters specifically to an EE, the domino chain showing how it cascades to firmware then to the program timeline, and the score breakdown showing exactly why it ranked first."

**4. Switch role to Product Manager, keep DVT.** "Same phase, different person. Watch the digest completely change. The PM doesn't need to know about R112 — they need to know the April 15 exit date is at risk. That's what surfaces."

**5. Switch phase to Prototype, keep PM.** "Now move back in time. The Murata supplier risk drops. Nobody's sweating the PO cadence in prototype. The open decision about chassis geometry rises instead. Same signals, totally different priorities."

**6. Switch to PVT.** "Now move forward. Everything tightens. Supplier risk is now critical — in PVT a late part can delay launch. The open question from the EM that was medium in DVT is now critical."

**7. Close with the score breakdown.** "Every ranking is explainable. It's not a black box. You can see exactly what went into the number."

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Pick a role and phase. The digest re-ranks instantly.

---

## File Structure

```
src/
  lib/
    scorer.js      ← the scoring formula — this is the core of the system
    generator.js   ← takes all signals, scores them, returns top 5
  data/
    mockData.js    ← 5 Slack threads + 6 extracted signals (the "database")
  components/
    Header.jsx     ← role picker + phase switcher
    ThreadPanel.jsx ← left panel: raw Slack threads
    DigestPanel.jsx ← right panel: ranked digest with grouping
    DigestCard.jsx  ← individual signal card (collapsed + expanded states)
    ImpactChain.jsx ← the domino chain visualization
  App.jsx          ← wires everything together, re-scores on role/phase change
```
