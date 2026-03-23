# How This Answers the Prompt

## What the prompt asked for

Build a daily digest tool for a hardware engineering team that:
1. Surfaces the most relevant info for each role
2. Adapts as the project phase changes

---

## The core problem in one sentence

Everyone's on Slack but an EE and a PM don't need to see the same things — and what matters in DVT is different from what mattered in Prototype.

---

## How the tool works — step by step

### Step 1: Read the Slack threads
The left panel shows 5 real Slack threads. Things like "the Murata cap lead time got pushed to 14 weeks" or "the U7 power rail is reading 0V and firmware is blocked."

These are raw, unfiltered. Nobody's told you what's important yet.

### Step 2: Pull out the signal from each thread
Each thread gets classified into a signal type:

- **Blocker** — someone can't move forward
- **Risk** — nobody's blocked yet, but something could go wrong
- **Decision** — a choice needs to be made
- **Open Question** — something was asked and nobody answered
- **Milestone Update** — a deadline changed
- **Dependency** — one team is waiting on another team

Each signal also gets tagged with: what subsystem it touches, who's involved, which teams are downstream of it, and how old it is.

### Step 3: Score the signal for the person reading it
This is where the personalization happens. Every signal gets a score based on 6 factors multiplied together:

```
score = role weight × phase weight × recency × urgency × ownership boost × reach
```

**Role weight** — how much does this role actually care about this signal type?
An EE cares a lot about dependencies (their work blocks others). A PM cares most about milestones. Supply chain cares most about risk. These are just numbers 0–1 that encode that.

**Phase weight** — how urgent is this type of signal right now in the project?
In Prototype, risk is expected and low-weight. In PVT, risk is nearly a launch blocker. The same signal scores differently depending on where you are.

**Recency** — newer signals score higher.
Hardware teams move slow so the decay is gentle. Something from yesterday is still very relevant.

**Urgency** — some signals get manually flagged as more time-sensitive.
Like "if this isn't resolved today the DVT PO can't be placed."

**Ownership boost** — if the signal touches your subsystem, you score it 1.85x higher.
An EE doesn't need to rank a supply chain thread the same as a blocker in their own board.

**Cross-functional reach** — if the signal affects 3 teams downstream, it scores higher for managers.
More affected teams = more important to people who are responsible for the whole program.

### Step 4: Rank and show the top 5
Sort by score, take the top 5, group by CRITICAL / HIGH / MEDIUM / LOW, show in the digest panel on the right.

### Step 5: Explain why it matters — for that specific person
Each signal has a different explanation written for each role.

The U7 blocker for an EE says: "you're the assigned owner, R112 is suspected, firmware is blocked, no update in 18 hours."

The same signal for a PM says: "if this isn't fixed today, DVT exit on April 15 slips 3–5 days."

Same signal. Different framing. Actually useful.

---

## What adapts as the phase changes

Switch the phase in the header and the digest re-ranks in real time.

In **Prototype**, decisions and open questions bubble up. Risk is tolerated. Schedule doesn't matter yet.

In **DVT**, risk and supply chain urgency jump. The Murata cap lead time slip that was medium in EVT is now high.

In **PVT**, almost everything is amplified. Any open question is a potential launch blocker. Blockers score 1.5x. Open questions score 1.5x. The team is tightening.

---

## What you see in the UI

**Left panel** — raw Slack threads. The actual messages, who said what, when. If a thread has gone stale (open 18+ hours with no update), it flags it in orange.

**Right panel** — personalized digest. Ranked by relevance for the selected role and phase. Click any card to expand it and see:
- Why it matters *to you specifically*
- The impact chain (how this signal cascades downstream)
- The score breakdown (every factor that went into the number)

---

## The one thing that makes this different from just reading Slack

The same thread produces completely different digest entries for different roles. Supply chain sees the Murata risk as their top item. The EE sees the U7 blocker first. The PM sees the firmware deadline dependency because it directly threatens April 15.

Nobody gets irrelevant noise. Everyone gets the framing that's actually actionable for them.
