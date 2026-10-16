import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeUrl, nameFromUrl, istInputToIso, formatIst, timeLeft, nextAction, urgency, sortEntries, nextUp } from '../logic.js';

const NOW = Date.parse('2026-10-12T06:30:00Z'); // 12 Oct 2026, 12:00 IST
const hrs = (h) => new Date(NOW + h * 3600e3).toISOString();

test('nameFromUrl reads Devpost subdomain', () => {
  assert.equal(nameFromUrl('https://learn-ai-basics.devpost.com/'), 'Learn Ai Basics');
  assert.equal(nameFromUrl('not a url'), '');
});

test('IST input converts to UTC and back', () => {
  const iso = istInputToIso('2026-10-27T02:30');
  assert.equal(iso, '2026-10-26T21:00:00.000Z');
  assert.equal(formatIst(iso), '27 Oct 2026, 02:30 IST');
  assert.equal(istInputToIso(''), null);
  assert.equal(istInputToIso('2026-02-31T10:00'), null);
  assert.equal(istInputToIso('2026-10-27T25:00'), null);
});

test('safeUrl keeps http(s) and drops script URLs', () => {
  assert.equal(safeUrl(' https://learn-ai-basics.devpost.com/ '), 'https://learn-ai-basics.devpost.com/');
  assert.equal(safeUrl('javascript:alert(1)'), null);
  assert.equal(safeUrl('not a url'), null);
});

test('timeLeft, nextAction, urgency', () => {
  const e = { deadline: hrs(52), status: 'drafting' };
  assert.equal(timeLeft(e, NOW), '2d 4h left');
  assert.equal(nextAction(e, NOW), 'Finish & submit');
  assert.equal(urgency(e, NOW), 'soon');
  assert.equal(urgency({ deadline: hrs(5), status: 'not-started' }, NOW), 'urgent');
  assert.equal(nextAction({ deadline: hrs(-1), status: 'drafting' }, NOW), 'Missed');
  assert.equal(nextAction({ deadline: hrs(-1), status: 'submitted' }, NOW), 'Done — wait for results');
});

test('sort: open by deadline, then submitted, then missed', () => {
  const list = [
    { id: 'missed', deadline: hrs(-5), status: 'drafting' },
    { id: 'sub', deadline: hrs(2), status: 'submitted' },
    { id: 'late', deadline: hrs(100), status: 'not-started' },
    { id: 'soon', deadline: hrs(10), status: 'drafting' },
  ];
  assert.deepEqual(sortEntries(list, NOW).map((e) => e.id), ['soon', 'late', 'sub', 'missed']);
  assert.equal(nextUp(list, NOW).id, 'soon');
});
