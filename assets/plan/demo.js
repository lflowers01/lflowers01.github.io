'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let renderMode = 'hybrid';
let clickEffect = 'wave';
const fields = [];
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const glyphs = ' .:-=+*#%@';
let frame = 0;
let lastFrame = 0;

function wake() {
  if (!frame && !document.hidden) frame = requestAnimationFrame(tick);
}
function tick(now) {
  frame = 0;
  if (document.hidden) return;
  if (now - lastFrame < 33) { wake(); return; }
  lastFrame = now;
  for (const field of fields) if (field.visible) field.draw(now);
  if (fields.some(field => field.visible && field.activeUntil > now)) wake();
}
function refreshFields() {
  for (const field of fields) field.activeUntil = performance.now() + 80;
  wake();
}

class ArtField {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.visible = false;
    this.activeUntil = 0;
    this.events = [];
    this.marks = new Map();
    this.pointer = null;
    this.previous = null;
    this.down = false;
    this.footer = canvas.id === 'footer-art';
    this.pad = canvas.id === 'effect-art';
    this.width = 1;
    this.height = 1;
    this.resize = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      this.width = Math.max(1, rect.width);
      this.height = Math.max(1, rect.height);
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(this.width * ratio);
      canvas.height = Math.round(this.height * ratio);
      this.ctx?.setTransform(ratio, 0, 0, ratio, 0, 0);
      this.draw(performance.now());
    });
    this.resize.observe(canvas);
    this.observer = new IntersectionObserver(entries => {
      this.visible = entries[0].isIntersecting;
      if (this.visible) { this.activeUntil = performance.now() + 100; wake(); }
    });
    this.observer.observe(canvas);
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const point = this.point(event);
      this.pulse(point.x, point.y);
      if (event.pointerType === 'mouse' || this.pad) {
        this.down = true;
        this.previous = null;
        canvas.setPointerCapture(event.pointerId);
        this.paint(point);
      }
    });
    canvas.addEventListener('pointermove', event => {
      this.pointer = this.point(event);
      if (this.down) this.paint(this.pointer);
      this.activeUntil = Math.max(this.activeUntil, performance.now() + 100);
      wake();
    });
    const finish = () => { this.down = false; this.previous = null; };
    canvas.addEventListener('pointerup', finish);
    canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('pointerleave', () => {
      if (!this.down) this.pointer = null;
      this.activeUntil = Math.max(this.activeUntil, performance.now() + 80);
      wake();
    });
    canvas.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.pulse(this.width * .65, this.height * .48);
      }
    });
  }
  point(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  }
  paint(point) {
    const previous = this.previous || point;
    const steps = Math.ceil(Math.hypot(point.x - previous.x, point.y - previous.y) / 4) || 1;
    const expires = performance.now() + (reducedMotion.matches ? 350 : 2400);
    for (let i = 0; i <= steps; i++) {
      const x = Math.floor((previous.x + (point.x - previous.x) * i / steps) / 8);
      const y = Math.floor((previous.y + (point.y - previous.y) * i / steps) / 8);
      if (x >= 0 && y >= 0 && x * 8 < this.width && y * 8 < this.height) this.marks.set(`${x},${y}`, { x, y, expires });
    }
    while (this.marks.size > 2048) this.marks.delete(this.marks.keys().next().value);
    this.previous = point;
    this.activeUntil = expires + 50;
    wake();
  }
  pulse(x, y) {
    const time = performance.now();
    this.events.push({ x, y, time, type: clickEffect });
    if (this.events.length > 8) this.events.shift();
    this.activeUntil = time + (reducedMotion.matches ? 350 : 1500);
    wake();
  }
  draw(now) {
    if (!this.ctx) return;
    const ctx = this.ctx, width = this.width, height = this.height;
    const style = getComputedStyle(document.body);
    const ink = style.getPropertyValue('--accent').trim();
    const copper = style.getPropertyValue('--copper').trim();
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = style.getPropertyValue('--grid').trim();
    for (let x = 0; x < width; x += 16) for (let y = 0; y < height; y += 16) ctx.fillRect(x, y, 1, 1);
    this.events = this.events.filter(event => now - event.time < (reducedMotion.matches ? 350 : 1500));
    const cell = this.pad ? 6 : 8;
    const narrowHero = width < 600 && !this.pad && !this.footer;
    const cx = width * (this.pad ? .52 : narrowHero ? .67 : .73);
    const cy = height * (this.footer ? .75 : narrowHero ? .67 : .43);
    const radius = this.pad ? Math.min(width * .30, height * .52) : narrowHero ? Math.min(width * .29, height * .25) : Math.min(width * .25, height * .40);
    ctx.font = `${cell + 1}px Departure, monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let y = 0, row = 0; y < height; y += cell, row++) {
      for (let x = 0, col = 0; x < width; x += cell, col++) {
        const nx = (x - cx) / radius, ny = (y - cy) / radius * 1.25;
        const r = Math.hypot(nx, ny);
        const angle = Math.atan2(ny, nx);
        const ring = Math.exp(-Math.pow((r - .70) * 6, 2));
        const shade = .42 + .35 * Math.cos(angle - 2.3) + .12 * Math.sin(angle * 4);
        let value = ring * shade;
        const orbit = Math.abs(ny + nx * .35);
        if (r < 1.27 && orbit < .026) value = Math.max(value, .62);
        const band = height - 30 - (Math.sin(x / 97) + Math.cos(x / 53)) * 12;
        if (y > band - 60) value = Math.max(value, Math.min(.65, Math.max(0, (y - band + 60) / 130)));
        if (this.footer) value *= .30;
        for (const event of this.events) {
          if (event.type !== 'wave') continue;
          const age = (now - event.time) / 1000;
          const distance = Math.hypot(x - event.x, y - event.y);
          const waveRadius = reducedMotion.matches ? 28 : age * 240;
          value += Math.exp(-Math.pow((distance - waveRadius) / 17, 2)) * Math.max(0, 1 - age / 1.5) * .8;
        }
        value = Math.min(1, Math.max(0, value));
        const threshold = (bayer[(row % 4) * 4 + col % 4] + .5) / 16;
        const lens = this.pointer && Math.hypot(x - this.pointer.x, y - this.pointer.y) < 100;
        const characters = renderMode === 'ascii' || (renderMode === 'hybrid' && (lens || (!this.pointer && nx + ny * .3 < 0)));
        ctx.fillStyle = ink;
        if (characters && value > .09) {
          ctx.globalAlpha = this.footer ? .6 : .9;
          ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(value * glyphs.length))], x + cell / 2, y + cell / 2);
        } else if (!characters && value > threshold) {
          ctx.globalAlpha = this.footer ? .65 : .85;
          ctx.fillRect(x + 1, y + 1, cell - 2, cell - 2);
        }
      }
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = copper;
    for (const [key, mark] of this.marks) {
      if (mark.expires <= now) { this.marks.delete(key); continue; }
      ctx.globalAlpha = reducedMotion.matches ? 1 : Math.min(1, (mark.expires - now) / 800);
      ctx.fillRect(mark.x * 8 + 1, mark.y * 8 + 1, 6, 6);
    }
    for (const event of this.events) {
      if (event.type === 'wave') continue;
      const age = (now - event.time) / 1000;
      const progress = reducedMotion.matches ? 0 : age;
      ctx.globalAlpha = Math.max(0, 1 - age / (reducedMotion.matches ? .35 : 1.5));
      ctx.fillStyle = copper;
      if (event.type === 'scatter') {
        for (let i = 0; i < 20; i++) {
          const angle = i * 2.399;
          const distance = 10 + progress * (45 + i % 5 * 15);
          ctx.fillText(':+*#'[i % 4], event.x + Math.cos(angle) * distance, event.y + Math.sin(angle) * distance);
        }
      } else {
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) {
          if (Math.abs(x) + Math.abs(y) <= 3 && (x + y) % 2 === 0) ctx.fillRect(Math.floor(event.x / 8) * 8 + x * 8, Math.floor(event.y / 8) * 8 + y * 8, 6, 6);
        }
      }
    }
    ctx.globalAlpha = 1;
  }
}
for (const canvas of document.querySelectorAll('.art-field')) fields.push(new ArtField(canvas));
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFields(); });
document.fonts.ready.then(refreshFields);
reducedMotion.addEventListener('change', () => {
  for (const field of fields) { field.events = []; field.marks.clear(); }
  refreshFields();
});

for (const button of document.querySelectorAll('[data-theme-choice]')) button.addEventListener('click', () => {
  document.body.dataset.theme = button.dataset.themeChoice;
  for (const sibling of document.querySelectorAll('[data-theme-choice]')) sibling.setAttribute('aria-pressed', String(sibling === button));
  refreshFields();
});
for (const button of document.querySelectorAll('[data-render]')) button.addEventListener('click', () => {
  renderMode = button.dataset.render;
  for (const sibling of document.querySelectorAll('[data-render]')) sibling.setAttribute('aria-pressed', String(sibling === button));
  refreshFields();
});
for (const button of document.querySelectorAll('[data-click-effect]')) button.addEventListener('click', () => {
  clickEffect = button.dataset.clickEffect;
  for (const sibling of document.querySelectorAll('[data-click-effect]')) sibling.setAttribute('aria-pressed', String(sibling === button));
  const pad = fields.find(field => field.pad);
  pad.pulse(pad.width * .5, pad.height * .5);
});
document.getElementById('clear-drawing').addEventListener('click', () => {
  for (const field of fields) { field.events = []; field.marks.clear(); }
  refreshFields();
});

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
  element.style.left = `${Math.max(0, board.clientWidth - element.offsetWidth) * note.x}px`;
  element.style.top = `${Math.max(0, board.clientHeight - element.offsetHeight) * note.y}px`;
}
function openNote(note) {
  document.getElementById('note-title').textContent = note.title;
  document.getElementById('note-text').textContent = note.text;
  document.getElementById('note-dialog').showModal();
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
      const maxX = Math.max(1, board.clientWidth - element.offsetWidth);
      const maxY = Math.max(1, board.clientHeight - element.offsetHeight);
      note.x = Math.max(0, Math.min(1, (drag.left + event.clientX - drag.startX) / maxX));
      note.y = Math.max(0, Math.min(1, (drag.top + event.clientY - drag.startY) / maxY));
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
document.getElementById('add-note').addEventListener('click', () => document.getElementById('compose-dialog').showModal());
document.getElementById('note-form').addEventListener('submit', event => {
  event.preventDefault();
  const title = document.getElementById('new-title').value.trim();
  const text = document.getElementById('new-text').value.trim();
  if (!title || !text || title.length > 64 || text.length > 1200 || notes.length >= 12) return;
  notes.push({ id: crypto.randomUUID(), title, text, x: .2 + notes.length % 3 * .23, y: .15 + notes.length % 4 * .16, color: notes.length % 3 });
  renderNotes(); saveNotes(); document.getElementById('compose-dialog').close(); event.target.reset();
});
document.getElementById('reset-board').addEventListener('click', () => {
  notes = initialNotes.map(note => ({ ...note })); renderNotes(); saveNotes();
});
for (const button of document.querySelectorAll('.dialog-close')) button.addEventListener('click', () => button.closest('dialog').close());
document.getElementById('note-dialog').setAttribute('aria-labelledby', 'note-title');

const photoCanvas = document.getElementById('photo-reveal');
const photoContext = photoCanvas.getContext('2d');
const portrait = new Image();
portrait.src = 'assets/plan/portrait-original.png';
let photoOriginal = null;
let photoDither = null;
function showPhoto(point = null, full = false) {
  if (!photoContext || !photoOriginal || !photoDither) return;
  photoContext.putImageData(photoDither, 0, 0);
  if (full) { photoContext.drawImage(photoOriginal, 0, 0); return; }
  if (point) {
    photoContext.save(); photoContext.beginPath(); photoContext.arc(point.x, point.y, 55, 0, Math.PI * 2); photoContext.clip(); photoContext.drawImage(photoOriginal, 0, 0); photoContext.restore();
  }
}
portrait.onload = () => {
  photoOriginal = document.createElement('canvas'); photoOriginal.width = 260; photoOriginal.height = 300;
  const context = photoOriginal.getContext('2d');
  if (!context) return;
  const scale = Math.max(260 / portrait.naturalWidth, 300 / portrait.naturalHeight);
  context.drawImage(portrait, (260 - portrait.naturalWidth * scale) / 2, (300 - portrait.naturalHeight * scale) / 2, portrait.naturalWidth * scale, portrait.naturalHeight * scale);
  const image = context.getImageData(0, 0, 260, 300);
  for (let y = 0; y < 300; y++) for (let x = 0; x < 260; x++) {
    const index = (y * 260 + x) * 4;
    const light = (image.data[index] * .2126 + image.data[index + 1] * .7152 + image.data[index + 2] * .0722) / 255;
    const value = light > (bayer[(y % 4) * 4 + x % 4] + .5) / 16 ? 232 : 0;
    image.data[index] = value; image.data[index + 1] = value; image.data[index + 2] = value;
  }
  photoDither = image; showPhoto(null, document.activeElement === photoCanvas);
};
portrait.onerror = () => { if (photoContext) { photoContext.fillStyle = '#ddd'; photoContext.font = '12px sans-serif'; photoContext.fillText('Portrait unavailable', 20, 150); } };
photoCanvas.addEventListener('pointermove', event => {
  const rect = photoCanvas.getBoundingClientRect();
  showPhoto({ x: (event.clientX - rect.left) * 260 / rect.width, y: (event.clientY - rect.top) * 300 / rect.height });
});
photoCanvas.addEventListener('pointerleave', () => showPhoto(null, document.activeElement === photoCanvas));
photoCanvas.addEventListener('focus', () => showPhoto(null, true));
photoCanvas.addEventListener('blur', () => showPhoto());
photoCanvas.addEventListener('pointerdown', () => showPhoto(null, true));

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

let flowerPlay = 0;
for (const trigger of document.querySelectorAll('.flower-trigger')) {
  const image = trigger.querySelector('[data-flower]');
  let hovered = false;
  let playing = false;
  function updateFlower() {
    const active = hovered || trigger.matches(':focus-visible');
    if (active && !playing && !reducedMotion.matches) {
      playing = true;
      image.src = `assets/plan/flower-grow.gif?play=${++flowerPlay}`;
    } else if (!active || reducedMotion.matches) {
      playing = false;
      image.src = 'assets/plan/flower-original.png';
    }
  }
  trigger.addEventListener('pointerenter', () => { hovered = true; updateFlower(); });
  trigger.addEventListener('pointerleave', () => { hovered = false; updateFlower(); });
  trigger.addEventListener('focus', updateFlower);
  trigger.addEventListener('blur', updateFlower);
  reducedMotion.addEventListener('change', updateFlower);
}
