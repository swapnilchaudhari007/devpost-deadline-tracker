# Changelog

All notable changes to DeadlineDeck are listed here.

## 2026-10-27

- Added this changelog.

## 1.0.0

- Add a hackathon by pasting its Devpost URL; the name is filled in automatically.
- Deadlines shown in IST with a live countdown.
- Cards sorted by what's due next and colour-coded by urgency (red < 24h, amber < 72h, blue otherwise, grey when done).
- "Next action" hint on every card.
- Data saved in the browser (localStorage key `deadlinedeck.v1`).
- Unit tests for the pure logic in `logic.js` (`node --test`).
