// Pure logic for DeadlineDeck — no DOM, so it can be tested with `node --test`.

export const IST_OFFSET_MIN = 330; // UTC+5:30

export const STATUSES = {
  'not-started': 'Not started',
  drafting: 'Drafting',
  submitted: 'Submitted',
};

// "https://learn-ai-basics.devpost.com/" -> "Learn Ai Basics"
export function nameFromUrl(url) {
  try {
    const u = new URL(url.trim());
    let slug = '';
    if (u.hostname.endsWith('.devpost.com') && u.hostname !== 'www.devpost.com') {
      slug = u.hostname.replace(/\.devpost\.com$/, '');
    } else {
      slug = u.pathname.split('/').filter(Boolean).pop() || u.hostname;
    }
    return slug
      .split(/[-_]+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } catch {
    return '';
  }
}

// Only http(s) links are stored, so a pasted "javascript:" URL can never run on click.
export function safeUrl(url) {
  try {
    const u = new URL(String(url).trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : null;
  } catch {
    return null;
  }
}

// "2026-10-27T02:30" typed as IST -> ISO UTC string
export function istInputToIso(value) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value || '');
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  // reject impossible dates like 2026-02-31 instead of silently rolling over
  const check = new Date(Date.UTC(y, mo - 1, d, h, mi));
  if (check.getUTCMonth() !== mo - 1 || check.getUTCDate() !== d || h > 23 || mi > 59) return null;
  const utcMs = Date.UTC(y, mo - 1, d, h, mi) - IST_OFFSET_MIN * 60000;
  return new Date(utcMs).toISOString();
}

// ISO UTC -> "27 Oct 2026, 02:30 IST"
export function formatIst(iso) {
  const d = new Date(new Date(iso).getTime() + IST_OFFSET_MIN * 60000);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())} IST`;
}

export function msLeft(entry, now = Date.now()) {
  return new Date(entry.deadline).getTime() - now;
}

export function timeLeft(entry, now = Date.now()) {
  const ms = msLeft(entry, now);
  if (ms <= 0) return 'Closed';
  const mins = Math.floor(ms / 60000);
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export function nextAction(entry, now = Date.now()) {
  if (entry.status === 'submitted') return 'Done — wait for results';
  if (msLeft(entry, now) <= 0) return 'Missed';
  if (entry.status === 'drafting') return 'Finish & submit';
  return 'Start the project';
}

// 'urgent' (<24h), 'soon' (<72h), 'normal', 'done' (submitted or closed)
export function urgency(entry, now = Date.now()) {
  const ms = msLeft(entry, now);
  if (entry.status === 'submitted' || ms <= 0) return 'done';
  if (ms < 24 * 3600e3) return 'urgent';
  if (ms < 72 * 3600e3) return 'soon';
  return 'normal';
}

// Open & unsubmitted by nearest deadline, then submitted, then missed.
export function sortEntries(entries, now = Date.now()) {
  const group = (e) => (e.status === 'submitted' ? 1 : msLeft(e, now) <= 0 ? 2 : 0);
  return [...entries].sort(
    (a, b) => group(a) - group(b) || new Date(a.deadline) - new Date(b.deadline)
  );
}

export function nextUp(entries, now = Date.now()) {
  return sortEntries(entries, now).find((e) => urgency(e, now) !== 'done') || null;
}
