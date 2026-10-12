---
doc: spec
status: draft
---
# DeadlineDeck — Technical Spec

## How This Works, In Plain Language
A static web page. `index.html` is the layout, `style.css` the look, `app.js` the logic. Entries are kept as a JSON list in the browser's localStorage. Pure logic (slug→name, sorting, countdown, next action) lives in `logic.js` so it can be unit-tested with Node.

## The Core Journey Through the System
URL typed → `nameFromUrl()` fills name → Add → entry pushed to list → `save()` to localStorage → `render()` sorts with `sortEntries()` and draws cards using `timeLeft()` and `nextAction()` → status change updates entry → save → render.

## Stack
Vanilla HTML/CSS/JS (ES modules), no build step. Tests: Node's built-in `node:test`.

## Where It Runs and How Someone Tries It
Any browser. `npx serve .` or `python3 -m http.server` then open http://localhost:8000 (ES modules need http, not file://). Tests: `node --test`.

## Data Model
`{ id, name, url, deadline (ISO UTC), status: 'not-started'|'drafting'|'submitted' }[]` under localStorage key `deadlinedeck.v1`. Deadline input is interpreted as IST (UTC+5:30).

## File Structure
index.html, style.css, app.js, logic.js, test/logic.test.js, README.md, devpost/
