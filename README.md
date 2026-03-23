# EverCurrent Digest

Built for the EverCurrent take-home. A daily digest tool for hardware engineering teams that personalizes what you see based on your role and where the project is.

---

## The problem in one sentence

Everyone's on the same Slack. Nobody's reading the same thing. And what matters to an electrical engineer is completely different from what matters to supply chain — and both of those change as the project gets closer to shipping.

Important stuff gets buried. People miss things. The team falls out of sync.

---

## What this does

Reads Slack threads, figures out what actually matters for each person, and shows them a ranked list with a plain-English explanation of why each item matters *to them specifically*.

Same threads. Completely different digest depending on who you are and where the project is.

---

## How the data flows

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
```

---

## The scenario (what the fake data is actually about)

The prototype is built around a real-feeling scenario: a robotics team in DVT — the phase where you're testing whether your design actually holds up under real conditions.

**The team:**
- Alex Chen — Electrical Engineer, owns the circuit board
- Raj Patel — Mechanical Engineer, owns the physical chassis
- Sarah Kim + James Wu — Supply Chain, manage parts and orders
- Priya Sharma — Firmware, writes the software that runs on the board
- Chris Okafor — Engineering Manager, responsible for the overall program
- Diana Park — Product Manager, owns the schedule and leadership updates

**What's going wrong this week:**

**1. The circuit board has a dead power rail** (`#evb-bring-up`)
One section of the board reads 0 volts when it should be 3.3 volts. Alex suspects a resistor that was accidentally left off during assembly (R112). He hasn't confirmed or fixed it. Priya's firmware team can't test any sensors until power comes back. Thread has been open 18 hours with no update.

**2. A key part won't arrive in time** (`#supply-chain`)
A capacitor (C47 — a small part that stabilizes power on the board) was ordered from Murata. Supplier just pushed delivery from 8 weeks to 14 — won't make the DVT build. There's an equivalent part from TDK that could work, but it's not on the approved parts list. Alex has to sign off on it. He hasn't responded in 12 hours. If he doesn't approve it this week, supply chain can't place the order.

**3. The chassis cracked during vibration testing** (`#dvt-testing`)
Standard shake test — simulating the robot running on rough terrain. Failed. Chassis cracked right at the mounting point where the circuit board screws in. Raj needs to redesign that area, but any geometry change could affect where Alex's board mounts. They need to sync before either finalizes anything. That sync hasn't happened.

**4. Leadership doesn't know any of this** (`#program`)
Diana needs to send a risk update to leadership by Friday. She asked Chris for the list of open risks. He said he'd send it. He never did. Thread went cold 22 hours ago. Three major program risks have zero leadership visibility.

**5. April 15 is at risk** (`#firmware-integration`)
Priya's team posted an update: CAN bus and motor controller are working. Everything sensor-related is blocked on the dead power rail. She needs it fixed today, then 2 days to finish sensor bring-up, then integration testing. If the rail slips even one day, April 15 is no longer realistic.

The dead power rail (thread 2) is the single most important thing in the program right now. It's blocking firmware, which is blocking DVT exit, which is what the PM is trying to report on to leadership. That hidden critical path is exactly what this tool surfaces — and exactly what gets lost in Slack.

---

## How it works

### Step 1 — read the raw threads

Left panel shows 5 Slack threads as-is. No filtering, no ranking. Just what people actually said.

### Step 2 — extract a typed signal from each thread

Each thread gets classified into one of six types:

| Type | What it means |
|------|---------------|
| Blocker | work is completely stopped |
| Risk | nothing's stuck yet, but something could go wrong |
| Decision | a choice needs to be made and waiting has a cost |
| Open Question | someone asked something and nobody answered |
| Milestone Update | a deadline changed |
| Dependency | one team's work is gated on another team |

Each signal gets tagged with who owns it, which subsystem it's in, which teams are affected downstream, and how old it is.

### Step 3 — score the signal for the person reading it

Every signal gets a number. Higher = more important to you right now.

```
score = role_weight × phase_weight × recency × urgency × ownership_boost × cf_reach
```

**Role weight** is how much each role structurally cares about each signal type. Supply chain cares most about risk (their job is catching part delays). EEs care most about blockers and dependencies (their work blocks other people constantly). PMs care most about milestones.

| Signal | EE | ME | Supply Chain | Eng Manager | PM |
|--------|----|----|--------------|-------------|-----|
| Blocker | 0.95 | 0.82 | 0.68 | 0.95 | 0.72 |
| Risk | 0.78 | 0.78 | 0.92 | 0.95 | 0.88 |
| Milestone | 0.60 | 0.52 | 0.78 | 0.90 | 0.95 |
| Dependency | 0.92 | 0.70 | 0.60 | 0.80 | 0.58 |

**Phase weight** is how much the project phase amplifies each signal type. In Prototype, risk is normal — you're still figuring stuff out. In PVT, an open risk is a potential launch blocker.

| Signal | Prototype | EVT | DVT | PVT |
|--------|-----------|-----|-----|-----|
| Blocker | 1.20 | 1.42 | 1.30 | 1.50 |
| Risk | 0.55 | 0.88 | 1.22 | 1.45 |
| Open Question | 1.30 | 1.10 | 1.05 | 1.50 |
| Milestone | 0.45 | 0.78 | 1.12 | 1.42 |

Same supplier delay. MEDIUM in EVT. CRITICAL in PVT. The signal data doesn't change — the phase weight does.

**Ownership boost** — if the signal is in your subsystem: ×1.85. If your team is downstream of it: ×1.45. Otherwise no boost.

**Recency** — decays slowly (`1 / (1 + 0.035t)`) because hardware teams move on day-scale cycles.

**Cross-functional reach** — every additional downstream team adds 18% to the score. Problems that affect multiple teams matter more to managers.

### Step 4 — rank, group, show top 5

Sort by score. Group into CRITICAL / HIGH / MEDIUM / LOW. Thresholds are tuned so you see 1–2 criticals in DVT max — if everything's critical, nothing is.

### Step 5 — explain it in terms that are useful for that person

Same signal, completely different explanation per role:

- **EE on U7 blocker:** "You're the assigned owner. R112 is suspected. Firmware is blocked — no update in 18 hours."
- **PM on U7 blocker:** "If this isn't fixed today, April 15 DVT exit slips 3–5 days."
- **Supply chain on U7 blocker:** "No direct impact. Watch for new BOM entries if a hardware fix is needed."

Same signal. Three different framings. Each person gets what they need to act.

---

## What changes when you switch phases

Switch the phase in the header. Whole digest re-ranks instantly.

- **Prototype** — decisions and open questions rise. Risk is suppressed. Nobody's watching the clock yet.
- **EVT** — blockers and dependencies amplify. Test failures show up first.
- **DVT** — supplier risk and spec changes get loud. Integration milestones matter.
- **PVT** — everything tightens. Any open question is a potential launch blocker.

---

## Tech stack

### What's built right now

| Layer | What | Why |
|-------|------|-----|
| UI | React 18 + Vite | fast to build, hot reload makes iteration instant |
| Styling | Inline CSS | no abstraction layer — easy to read and change |
| Scoring | Pure JS, runs in the browser | stateless, no server needed for the prototype |
| Data | Hand-written mock JSON | proves the concept without building infra first |

No backend. No database. No API keys. Runs entirely in the browser. This is on purpose — the prototype is here to prove the *idea*, not the infrastructure.

### What production looks like

| Layer | What | Why |
|-------|------|-----|
| Signal ingestion | Slack Events API | real-time stream from all channels |
| Signal extraction | LLM with structured JSON output | flexible classification without writing rules for every thread pattern |
| Storage | PostgreSQL | persist signals, compute recency at query time, store feedback |
| Scoring service | Stateless microservice | accepts `{ role, phase }`, returns ranked digest — same service feeds Slack bot, web, email |
| Delivery | Slack DM + `/digest` slash command | meets users where they already are |
| Weight refinement | Online learning on click/dismiss/save signals | weights drift toward what actually matters to each person over time |

The scoring engine is identical between prototype and production. The only difference is where signals come from (hand-written vs LLM-extracted) and where the digest goes (browser vs Slack DM).

---

## Impact

### What it actually fixes

Hardware teams in DVT typically have 10–20 active Slack channels. An engineer who reads everything loses 30–60 minutes a day to noise. One who doesn't read everything misses things that cost the program days.

The digest replaces that tradeoff. Read one thing in 2 minutes. Know exactly what needs your attention.

**Blockers get seen faster.** Blockers that stay open because the right person never saw them are one of the biggest sources of schedule slip in hardware. The digest puts them directly in front of whoever can unblock them.

**Risk gets caught earlier.** Supply chain risks and interface conflicts are often visible in Slack days before they become formal program issues. The digest surfaces them while there's still time to act.

**Fewer meetings.** A lot of syncs exist to redistribute information that got buried. If everyone already knows what matters, those meetings get shorter or go away.

### Rough ROI

If the tool saves each engineer 20 minutes per day of Slack triage, on a 10-person team at $200/hr fully loaded:

```
10 × 20min × $200/hr = ~$667/day → ~$167k/year in recovered time
```

That's just the time savings. One blocker surfaced a day earlier in DVT can easily be worth more than that in avoided schedule slip.

### Gets better over time

The scoring starts with heuristics but learns. Every click, dismiss, and save is a signal. Over time the weights drift toward what actually matters to each specific person — not just their role archetype.

---

## Common questions

**How are the weights chosen?**

They're heuristics right now, which is intentional. Heuristics are interpretable — you can look at the table and immediately check whether they make sense. A learned model doesn't give you that.

In production I'd keep the heuristics as initialization and refine from behavioral feedback: what people click, dismiss, save, rate. That's an online learning problem, but you don't start there — you'd have nothing to learn from yet.

**How reliable is signal extraction?**

In the prototype, signals are hand-written so extraction is perfect. In production with an LLM classifying threads, the key is graceful degradation — constrain output to a strict JSON schema, require a confidence score, rank low-confidence signals lower rather than hiding them. Users can correct misclassifications and corrections become training data.

Rather degrade gracefully than overstate certainty.

**What makes this more than summarization?**

Summarization tells you what happened. This tells you what matters *to you* right now — based on your role, what you own, who's downstream of you, and where the project is. Same thread, completely different output per person.

Summarization reduces content. This routes it.

**Why a web UI and not Slack-native?**

In production it'd be Slack — daily DM and a `/digest` slash command. Web UI exists for the prototype because it makes the ranking logic inspectable. You can click a card, see the score breakdown, switch roles, compare. Hard to do in a Slack message. The scoring service is identical either way.

---

## Running locally

```bash
npm install
npm run dev
```

[http://localhost:5173](http://localhost:5173) — pick a role and phase, digest re-ranks instantly.

---

## File map

```
src/
  lib/
    scorer.js       ← the scoring formula — core of the whole system
    generator.js    ← scores all signals, returns top 5 for role + phase
  data/
    mockData.js     ← 5 Slack threads + 6 extracted signals
  components/
    Header.jsx      ← role picker + phase switcher
    ThreadPanel.jsx ← left: raw Slack threads
    DigestPanel.jsx ← right: ranked digest
    DigestCard.jsx  ← individual card, collapsed + expanded
    ImpactChain.jsx ← domino chain visualization
  App.jsx           ← wires it together, re-scores on role/phase change
```
