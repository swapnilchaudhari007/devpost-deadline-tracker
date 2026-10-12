---
doc: prd
status: draft
---
# DeadlineDeck — Product Requirements
A one-screen deadline board for a developer juggling many Devpost hackathons. Source: `scope.md > The Unique Kernel`.

## The Core Journey
1. Open `index.html`. First time: empty state explains "Add your first hackathon".
2. Paste a Devpost URL (e.g. `https://learn-ai-basics.devpost.com/`). Name auto-fills ("Learn Ai Basics"); editable.
3. Pick the deadline (date + time, IST) and status (Not started / Drafting / Submitted). Click Add.
4. The card appears in the list, sorted: unsubmitted entries by nearest deadline first, then submitted, then past-deadline.
5. Each card shows name (link), deadline in IST, countdown ("2d 4h left"), status dropdown and a next-action line.
6. A summary bar at top: "Next up: <name> — <action> — <time left>".
7. Change status from the card; list re-sorts. Delete with a ✕ (confirm).
8. Reload: everything is still there.

## Screens and Layout
Single page: header + summary bar, add form (one row on desktop, stacked on phone), card list.

## Look and Feel
Light, clean cards; urgency color on the left edge: red < 24h, amber < 72h, blue otherwise, grey submitted/closed. System font.

## Features and Behavior
- Next action: Not started → "Start the project"; Drafting → "Finish & submit"; Submitted → "Done — wait for results"; past deadline & not submitted → "Missed".
- Countdown refreshes every minute.

## States and Boundaries
- **Empty** — friendly prompt.
- **Invalid input** — Add disabled-feedback if URL or deadline missing.
- **Persistence** — localStorage in this browser only.

## Product Decisions
- Manual deadline entry (agent proposal) — avoids CORS/scraping; fast enough.
- IST fixed — learner is in Thane.

## What We're Building
Everything in The Core Journey.

## Deferred From the POC
Auto-fetch from Devpost, notifications, multi-device sync.
