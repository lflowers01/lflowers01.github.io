const board = document.getElementById('note-board');
const status = document.getElementById('board-status');
const storageKey = 'lf.plan.notes.v1';
const initialNotes = [
  { id: 'sample-1', title: 'A thought, unfinished.', text: 'This is where a quick idea could go. A few lines, a question, or something worth coming back to.\n\nSample copy for the board, not an entry written by Lucas.', x: .08, y: .12, color: 0 },
  { id: 'sample-2', title: 'Things to look into', text: 'A small collection of references, a book, a sketch, or something seen around campus.\n\nLonger notes would have a normal page and a direct link too.', x: .86, y: .15, color: 1 },
  { id: 'sample-3', title: 'From the workbench', text: 'A place for an in-progress picture or a quick observation before it becomes a full project.\n\nThe final board can hold your current notes without importing old school projects.', x: .43, y: .83, color: 2 }
];
let notes = initialNotes.map(note => ({ ...note }));
let layer = 1;
let drag = null;
function validNotes(value) {
  return Array.isArray(value) && value.length > 0 && value.length <= 12 && new Set(value.map(note => note?.id)).size === value.length && value.every(note => note && typeof note.id === 'string' && note.id.length <= 80 && typeof note.title === 'string' && note.title.trim().length > 0 && note.title.length <= 64 && typeof note.text === 'string' && note.text.trim().length > 0 && note.text.length <= 1200 && Number.isFinite(note.x) && note.x >= 0 && note.x <= 1 && Number.isFinite(note.y) && note.y >= 0 && note.y <= 1 && Number.isInteger(note.color) && note.color >= 0 && note.color <= 2);
}
try {
  const saved = JSON.parse(localStorage.getItem(storageKey));
  if (validNotes(saved)) notes = saved;
} catch { status.textContent = 'Sample notes. Browser storage is unavailable; changes last for this visit.'; }
function saveNotes() {
  try { localStorage.setItem(storageKey, JSON.stringify(notes)); status.textContent = 'Saved in this browser only. This does not change anyone else’s board.'; }
  catch { status.textContent = 'Browser storage is unavailable; changes last for this visit.'; }
}
function placeNote(element, note) {
  element.style.left = `${12 + Math.max(0, board.clientWidth - element.offsetWidth - 24) * note.x}px`;
  element.style.top = `${12 + Math.max(0, board.clientHeight - element.offsetHeight - 24) * note.y}px`;
}
function openNote(note) {
  document.getElementById('note-title').textContent = note.title;
  document.getElementById('note-text').textContent = note.text;
  const reading = document.getElementById('note-reading');
  reading.hidden = false; reading.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
  document.getElementById('note-title').focus({ preventScroll: true });
}
function renderNotes() {
  board.replaceChildren();
  notes.forEach((note, index) => {
    const element = document.createElement('article');
    element.className = 'sticky'; element.dataset.id = note.id;
    element.style.setProperty('--angle', `${[-4, 3, -2][index % 3]}deg`);
    element.style.setProperty('--note-color', ['#ded4ae', '#c3cdb3', '#d2b79b'][note.color]);
    const handle = document.createElement('button');
    handle.type = 'button'; handle.className = 'note-handle';
    handle.textContent = 'Move note'; handle.setAttribute('aria-label', `Move ${note.title}. Use arrow keys.`);
    const open = document.createElement('button');
    open.type = 'button'; open.className = 'note-open';
    const title = document.createElement('strong'); title.textContent = note.title;
    const excerpt = document.createElement('span'); excerpt.textContent = note.text;
    open.append(title, excerpt); element.append(handle, open); board.append(element);
    placeNote(element, note);
    open.addEventListener('click', () => { element.style.zIndex = String(++layer); openNote(note); });
    handle.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? .01 : .04;
      note.x = Math.max(0, Math.min(1, note.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0)));
      note.y = Math.max(0, Math.min(1, note.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)));
      element.style.zIndex = String(++layer); placeNote(element, note); saveNotes();
    });
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); handle.focus();
      element.style.zIndex = String(++layer);
      element.dataset.dragging = 'true';
      drag = { element, note, startX: event.clientX, startY: event.clientY, left: parseFloat(element.style.left), top: parseFloat(element.style.top) };
      handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointermove', event => {
      if (!drag || drag.element !== element) return;
      const maxX = Math.max(1, board.clientWidth - element.offsetWidth - 24);
      const maxY = Math.max(1, board.clientHeight - element.offsetHeight - 24);
      note.x = Math.max(0, Math.min(1, (drag.left + event.clientX - drag.startX - 12) / maxX));
      note.y = Math.max(0, Math.min(1, (drag.top + event.clientY - drag.startY - 12) / maxY));
      placeNote(element, note);
    });
    const finishDrag = () => {
      if (!drag || drag.element !== element) return;
      element.dataset.dragging = 'false'; drag = null; saveNotes();
    };
    handle.addEventListener('pointerup', finishDrag);
    handle.addEventListener('pointercancel', finishDrag);
    handle.addEventListener('lostpointercapture', finishDrag);
  });
  document.getElementById('add-note').disabled = notes.length >= 12;
}
renderNotes();
new ResizeObserver(() => {
  for (const element of board.children) {
    const note = notes.find(item => item.id === element.dataset.id);
    if (note) placeNote(element, note);
  }
}).observe(board);
document.getElementById('add-note').addEventListener('click', () => { document.getElementById('compose-dialog').hidden = false; document.getElementById('new-title').focus(); });
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = document.getElementById('new-title').value.trim();
  const text = document.getElementById('new-text').value.trim();
  if (!title || !text || title.length > 64 || text.length > 1200 || notes.length >= 12) return;
  notes.push({ id: crypto.randomUUID(), title, text, x: .2 + notes.length % 3 * .23, y: .15 + notes.length % 4 * .16, color: notes.length % 3 });
  renderNotes(); saveNotes(); document.getElementById('compose-dialog').hidden = true; event.target.reset();
});
document.getElementById('reset-board').addEventListener('click', () => {
  notes = initialNotes.map(note => ({ ...note })); renderNotes(); saveNotes();
});
for (const button of document.querySelectorAll('.dialog-close')) button.addEventListener('click', () => document.getElementById('compose-dialog').hidden = true);
document.getElementById('close-note').addEventListener('click', () => { document.getElementById('note-reading').hidden = true; document.querySelector('.note-open')?.focus({ preventScroll: true }); });

const stamp = document.getElementById('site-stamp');
stamp.addEventListener('click', () => {
  const flipped = stamp.dataset.flipped !== 'true'; stamp.dataset.flipped = String(flipped);
  stamp.querySelector('span').textContent = flipped ? 'Thanks for visiting' : 'Lucas Flowers';
});
const decode = document.querySelector('.decode-link');
let decodeTimer;
function revealLink() {
  clearInterval(decodeTimer);
  const span = decode.querySelector('span'), original = span.dataset.original;
  if (reducedMotion.matches) { span.textContent = original; return; }
  let count = 0;
  decodeTimer = setInterval(() => {
    count++;
    span.textContent = [...original].map((character, index) => index < count * 3 || character === ' ' ? character : ':./+'[(index + count) % 4]).join('');
    if (count * 3 >= original.length) clearInterval(decodeTimer);
  }, 40);
}
decode.addEventListener('pointerenter', revealLink); decode.addEventListener('focus', revealLink);
function restoreLink() { clearInterval(decodeTimer); decode.querySelector('span').textContent = decode.querySelector('span').dataset.original; }
decode.addEventListener('pointerleave', restoreLink); decode.addEventListener('blur', restoreLink);
let markClicks = 0;
document.getElementById('maker-mark').addEventListener('click', () => {
  markClicks++;
  if (markClicks >= 3) { document.getElementById('hidden-sketch').hidden = false; document.getElementById('maker-mark').setAttribute('aria-label', 'Robot sketch revealed'); }
});
