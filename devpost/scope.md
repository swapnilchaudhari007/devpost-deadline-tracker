---
doc: scope
status: draft
---
# DeadlineDeck

A one-screen board that shows every hackathon you've entered, sorted by what's due next, and tells you the next thing to do.

## The Unique Kernel
Not a calendar: each entry carries its **submission status**, and the board turns deadline + status into one **"do this next"** line, colored by urgency. An unsubmitted entry due in 2 days shouts; a submitted one fades away.

## Who It's For
A solo developer (Swapnil, Thane) entered in ~10 Devpost hackathons at once. Today: a pile of browser tabs and memory, with deadlines in mixed time zones.

## The Core Loop
Open the board → look at the top card → do that action (or update its status) → close. Comes back daily.

## Inspiration & Identity
Devpost's own clean card style; calm until something is urgent. Times always in IST.

## Why This Matters to the Learner
Juggling many entries makes it easy to miss a deadline or forget a half-done draft.

## What "Working" Looks Like
Paste a Devpost URL, the name fills itself in; add a deadline; set a status. The list re-sorts, shows "2d 4h left" in IST, and the top unsubmitted entry is highlighted with its next action. Data is still there after reload.

## The POC Boundary
Add / edit status / delete entries; name auto-filled from URL; deadline in IST; countdown; urgency colors; next-action text; sort; persists in the browser.

## Later
Auto-fetching deadlines from Devpost; reminders/notifications; export to calendar.

## Explicitly Cut
- Accounts/sync — single user, single browser is enough to prove the loop.
- Scraping Devpost — CORS + fragile; manual deadline entry takes 5 seconds.
