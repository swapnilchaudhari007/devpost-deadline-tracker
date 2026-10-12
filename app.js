import {
  STATUSES, nameFromUrl, istInputToIso, formatIst, timeLeft, nextAction, urgency, sortEntries, nextUp,
} from './logic.js';

const KEY = 'deadlinedeck.v1';
const $ = (id) => document.getElementById(id);

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(entries)); } catch { /* storage unavailable */ }
}

let entries = load();
let nameTouched = false;

function el(tag, attrs = {}, text) {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => n.setAttribute(k, v));
  if (text !== undefined) n.textContent = text;
  return n;
}

function render() {
  const now = Date.now();
  const list = $('list');
  list.replaceChildren();

  const up = nextUp(entries, now);
  $('summary').textContent = up
    ? `Next up: ${up.name} — ${nextAction(up, now)} — ${timeLeft(up, now)}`
    : entries.length ? 'All caught up. Nothing open needs action.' : '';
  $('summary').className = 'summary' + (up ? ` ${urgency(up, now)}` : '');

  if (!entries.length) {
    list.append(el('p', { class: 'empty' }, 'No hackathons yet. Paste a Devpost URL above to add your first one.'));
    return;
  }

  for (const e of sortEntries(entries, now)) {
    const card = el('article', { class: `card ${urgency(e, now)}`, 'data-id': e.id });
    const top = el('div', { class: 'card-top' });
    const a = el('a', { href: e.url, target: '_blank', rel: 'noopener' }, e.name);
    const del = el('button', { class: 'del', 'aria-label': `Delete ${e.name}`, title: 'Delete' }, '✕');
    del.onclick = () => {
      if (confirm(`Remove ${e.name}?`)) { entries = entries.filter((x) => x.id !== e.id); save(); render(); }
    };
    top.append(a, del);

    const meta = el('div', { class: 'meta' });
    meta.append(el('span', { class: 'left' }, timeLeft(e, now)), el('span', {}, formatIst(e.deadline)));

    const bottom = el('div', { class: 'card-bottom' });
    const sel = el('select', { 'aria-label': `Status for ${e.name}` });
    for (const [v, label] of Object.entries(STATUSES)) {
      const o = el('option', { value: v }, label);
      if (v === e.status) o.selected = true;
      sel.append(o);
    }
    sel.onchange = () => { e.status = sel.value; save(); render(); };
    bottom.append(el('span', { class: 'action' }, nextAction(e, now)), sel);

    card.append(top, meta, bottom);
    list.append(card);
  }
}

$('url').addEventListener('input', () => {
  if (!nameTouched) $('name').value = nameFromUrl($('url').value);
});
$('name').addEventListener('input', () => { nameTouched = $('name').value.trim() !== ''; });

$('add-form').addEventListener('submit', (ev) => {
  ev.preventDefault();
  const url = $('url').value.trim();
  const name = $('name').value.trim() || nameFromUrl(url);
  const deadline = istInputToIso($('deadline').value);
  if (!url || !name || !deadline) {
    $('form-error').textContent = 'Add a URL, a name and a deadline.';
    return;
  }
  $('form-error').textContent = '';
  entries.push({ id: crypto.randomUUID(), name, url, deadline, status: $('status').value });
  save();
  ev.target.reset();
  nameTouched = false;
  render();
});

render();
setInterval(render, 60000);
