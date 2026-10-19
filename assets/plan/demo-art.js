'use strict';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const glyphs = ' .:-=+*#%@';
let renderMode = 'hybrid', clickEffect = 'wave', frame = 0, lastFrame = 0;
const fields = [];
function wake() { if (!frame && !document.hidden) frame = requestAnimationFrame(tick); }
function tick(now) {
  frame = 0;
  if (document.hidden) return;
  if (now - lastFrame < 42) { wake(); return; }
  lastFrame = now;
  for (const field of fields) if (field.visible) field.draw(now);
  if (fields.some(field => field.visible && ((!reducedMotion.matches && field.spins) || field.activeUntil > now))) wake();
}
function refreshFields() { for (const field of fields) field.activeUntil = performance.now() + 100; wake(); }
function cross(ctx, x, y, size) {
  const half = size / 2;
  ctx.beginPath(); ctx.moveTo(x - half, y - half); ctx.lineTo(x + half, y + half);
  ctx.moveTo(x + half, y - half); ctx.lineTo(x - half, y + half); ctx.stroke();
}

class ArtField {
  constructor(canvas) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.visible = false; this.activeUntil = 0; this.events = []; this.marks = new Map();
    this.pointer = null; this.previous = null; this.down = false; this.width = 1; this.height = 1;
    this.footer = canvas.id === 'footer-art'; this.pad = canvas.id === 'effect-art';
    this.header = canvas.id === 'navigation-art'; this.ambient = canvas.id === 'ambient-art';
    this.spins = canvas.id === 'hero-art';
    new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect(); this.width = rect.width || 1; this.height = rect.height || 1;
      const ratio = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(this.width * ratio); canvas.height = Math.round(this.height * ratio);
      this.ctx?.setTransform(ratio, 0, 0, ratio, 0, 0); this.draw(performance.now());
    }).observe(canvas);
    new IntersectionObserver(entries => {
      this.visible = entries[0].isIntersecting;
      if (this.visible) { this.activeUntil = performance.now() + 100; wake(); }
    }).observe(canvas);
    if (this.header || this.ambient) return;
    canvas.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      const point = this.point(event); this.pulse(point.x, point.y);
      if (event.pointerType === 'mouse' || this.pad) {
        this.down = true; this.previous = null; canvas.setPointerCapture(event.pointerId);
      }
    });
    canvas.addEventListener('pointermove', event => {
      this.pointer = this.point(event);
      if (this.down) this.paint(this.pointer);
      this.activeUntil = Math.max(this.activeUntil, performance.now() + 150); wake();
    });
    const finish = () => { this.down = false; this.previous = null; };
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('pointerleave', () => { this.pointer = null; this.activeUntil = Math.max(this.activeUntil, performance.now() + 100); wake(); });
    canvas.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.pulse(this.width * .65, this.height * .48); }
    });
  }
  point(event) { const rect = this.canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
  pulse(x, y) {
    const time = performance.now(); this.events.push({ x, y, time, type: clickEffect });
    if (this.events.length > 6) this.events.shift();
    this.activeUntil = time + (reducedMotion.matches ? 250 : 2500); wake();
  }
  paint(point) {
    const previous = this.previous || point;
    const steps = Math.ceil(Math.hypot(point.x - previous.x, point.y - previous.y) / 5) || 1;
    const expires = performance.now() + (reducedMotion.matches ? 250 : 2000);
    for (let i = 0; i <= steps; i++) {
      const x = Math.floor((previous.x + (point.x - previous.x) * i / steps) / 8);
      const y = Math.floor((previous.y + (point.y - previous.y) * i / steps) / 8);
      if (x >= 0 && y >= 0 && x * 8 < this.width && y * 8 < this.height) this.marks.set(`${x},${y}`, { x, y, expires });
    }
    while (this.marks.size > 1800) this.marks.delete(this.marks.keys().next().value);
    this.previous = point; this.activeUntil = expires + 100; wake();
  }
  objectField(now, cell) {
    const width = this.width, height = this.height, cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    const light = new Float32Array(cols * rows), depth = new Float32Array(cols * rows).fill(-10);
    const narrow = width < 600 && !this.pad;
    const cx = width * (this.pad ? .54 : narrow ? .55 : .75);
    const cy = height * (narrow ? .68 : .46);
    const size = this.pad ? Math.min(width * .25, height * .52) : narrow ? Math.min(width * .38, height * .23) : Math.min(width * .25, height * .42);
    const angle = reducedMotion.matches ? .6 : now / 4800;
    const ca = Math.cos(angle), sa = Math.sin(angle), tilt = .8;
    const project = (x, y, z, value) => {
      const a = x * ca + z * sa, b = -x * sa + z * ca;
      const c = y * Math.cos(tilt) - b * Math.sin(tilt), d = y * Math.sin(tilt) + b * Math.cos(tilt);
      const perspective = 1 / (1 - d * .2);
      const px = Math.floor((cx + a * size * perspective) / cell), py = Math.floor((cy + c * size * perspective) / cell);
      if (px < 0 || py < 0 || px >= cols || py >= rows) return;
      const index = py * cols + px;
      if (d > depth[index]) { depth[index] = d; light[index] = value; }
    };
    for (let ring = 0; ring < 2; ring++) {
      for (let u = 0; u < Math.PI * 2; u += .055) {
        for (let v = 0; v < Math.PI * 2; v += .20) {
          const radius = ring ? .91 : .64, tube = ring ? .055 : .23;
          const x = (radius + tube * Math.cos(v)) * Math.cos(u);
          const y = (radius + tube * Math.cos(v)) * Math.sin(u), z = tube * Math.sin(v);
          const shade = .27 + .65 * Math.max(0, Math.cos(v + angle) * .55 + Math.sin(u) * .45);
          if (ring) project(x, z, y, .57 + .23 * Math.cos(u)); else project(x, y, z, shade);
        }
      }
    }
    return { light, cols };
  }
  draw(now) {
    const ctx = this.ctx; if (!ctx) return;
    const width = this.width, height = this.height, style = getComputedStyle(document.body);
    const ink = style.getPropertyValue('--accent').trim(), copper = style.getPropertyValue('--copper').trim();
    ctx.clearRect(0, 0, width, height); ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    if (this.header || this.ambient) {
      const cell = this.header ? 8 : 22;
      for (let y = 4; y < height; y += cell) for (let x = 4; x < width; x += cell) {
        const distance = this.pointer ? Math.hypot(x - this.pointer.x, (y - this.pointer.y) * (this.header ? .5 : 1)) : 1000;
        const influence = Math.max(0, 1 - distance / (this.header ? 180 : 160));
        const base = this.header ? .25 * Math.pow(1 - y / height, 2) : 0;
        ctx.globalAlpha = base + influence * (this.header ? .45 : .10);
        if (ctx.globalAlpha > .005) cross(ctx, x, y, this.header ? 2 + influence * 3 : 3);
      }
      ctx.globalAlpha = 1; return;
    }
    this.events = this.events.filter(event => now - event.time < (reducedMotion.matches ? 250 : 2500));
    const cell = this.pad ? 6 : 7;
    const object = this.footer ? null : this.objectField(now, cell);
    ctx.font = `${cell + 1}px Departure, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let y = 0, row = 0; y < height; y += cell, row++) for (let x = 0, col = 0; x < width; x += cell, col++) {
      let value = object ? object.light[row * object.cols + col] || 0 : 0;
      if (this.footer) value = Math.max(0, .24 - Math.abs(y / height - .8) * .35);
      let offsetX = 0, offsetY = 0;
      for (const event of this.events) {
        if (event.type !== 'wave') continue;
        const age = (now - event.time) / 1000, distance = Math.hypot(x - event.x, y - event.y);
        const radius = reducedMotion.matches ? 30 : age * 230;
        const envelope = Math.exp(-Math.pow((distance - radius) / 36, 2)) * Math.max(0, 1 - age / 2.5);
        const wave = Math.sin((distance - radius) / 8) * envelope;
        value += wave * .52 + envelope * .17;
        offsetX += (x - event.x) / Math.max(1, distance) * wave * 7;
        offsetY += (y - event.y) / Math.max(1, distance) * wave * 7;
      }
      const threshold = (bayer[(row % 4) * 4 + col % 4] + .5) / 16;
      const lens = this.pointer && Math.hypot(x - this.pointer.x, y - this.pointer.y) < 105;
      const characters = renderMode === 'ascii' || (renderMode === 'hybrid' && lens);
      ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.globalAlpha = this.footer ? .30 : .88;
      if (characters && value > .08) ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(Math.min(1, value) * glyphs.length))], x + cell / 2 + offsetX, y + cell / 2 + offsetY);
      else if (!characters && value > threshold) cross(ctx, x + cell / 2 + offsetX, y + cell / 2 + offsetY, cell - 3);
    }
    ctx.strokeStyle = copper; ctx.fillStyle = copper;
    for (const [key, mark] of this.marks) {
      if (mark.expires <= now) { this.marks.delete(key); continue; }
      ctx.globalAlpha = Math.min(1, (mark.expires - now) / 700); cross(ctx, mark.x * 8 + 4, mark.y * 8 + 4, 5);
    }
    for (const event of this.events) {
      if (event.type === 'wave') continue;
      const age = (now - event.time) / 1000, progress = reducedMotion.matches ? 0 : age;
      ctx.globalAlpha = Math.max(0, 1 - age / 1.5);
      for (let i = 0; i < 20; i++) {
        const angle = i * 2.399, distance = 10 + progress * (40 + i % 5 * 12);
        if (event.type === 'scatter') ctx.fillText(':+*#'[i % 4], event.x + Math.cos(angle) * distance, event.y + Math.sin(angle) * distance);
        else cross(ctx, event.x + Math.cos(angle) * 25, event.y + Math.sin(angle) * 25, 4);
      }
    }
    ctx.globalAlpha = 1;
  }
}
for (const canvas of document.querySelectorAll('.art-field')) fields.push(new ArtField(canvas));
document.addEventListener('pointermove', event => {
  for (const field of fields.filter(field => field.header || field.ambient)) {
    const point = field.point(event);
    field.pointer = point.x >= 0 && point.y >= 0 && point.x < field.width && point.y < field.height ? point : null;
    field.activeUntil = performance.now() + 100;
  }
  wake();
}, { passive: true });
document.addEventListener('pointerleave', () => { for (const field of fields) field.pointer = null; refreshFields(); });
document.addEventListener('visibilitychange', () => { if (!document.hidden) refreshFields(); });
document.fonts.ready.then(refreshFields);
reducedMotion.addEventListener('change', () => { for (const field of fields) { field.events = []; field.marks.clear(); } refreshFields(); });
for (const button of document.querySelectorAll('[data-render]')) button.addEventListener('click', () => {
  renderMode = button.dataset.render;
  for (const sibling of document.querySelectorAll('[data-render]')) sibling.setAttribute('aria-pressed', String(sibling === button));
  refreshFields();
});
for (const button of document.querySelectorAll('[data-click-effect]')) button.addEventListener('click', () => {
  clickEffect = button.dataset.clickEffect;
  for (const sibling of document.querySelectorAll('[data-click-effect]')) sibling.setAttribute('aria-pressed', String(sibling === button));
  const pad = fields.find(field => field.pad); pad.pulse(pad.width * .5, pad.height * .5);
});
document.getElementById('clear-drawing').addEventListener('click', () => { for (const field of fields) { field.events = []; field.marks.clear(); } refreshFields(); });

const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', event => {
  if (document.documentElement.classList.contains('theme-switching')) return;
  const next = document.body.dataset.theme === 'oled' ? 'forest' : 'oled';
  const rect = themeToggle.getBoundingClientRect();
  document.documentElement.style.setProperty('--switch-x', `${event.clientX || rect.left + rect.width / 2}px`);
  document.documentElement.style.setProperty('--switch-y', `${event.clientY || rect.top + rect.height / 2}px`);
  const update = () => {
    document.body.dataset.theme = next;
    themeToggle.setAttribute('aria-label', `Switch to ${next === 'oled' ? 'forest green' : 'OLED black'}`);
    themeToggle.title = themeToggle.getAttribute('aria-label');
    refreshFields();
  };
  if (document.startViewTransition && !reducedMotion.matches) {
    document.documentElement.classList.add('theme-switching');
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => document.documentElement.classList.remove('theme-switching'));
  } else {
    update();
    if (!reducedMotion.matches) { document.body.classList.add('theme-flash'); setTimeout(() => document.body.classList.remove('theme-flash'), 650); }
  }
});
