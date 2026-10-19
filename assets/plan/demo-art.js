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
  if (now - lastFrame < (reducedMotion.matches ? 80 : 42)) { wake(); return; }
  lastFrame = now;
  for (const field of fields) if (field.visible) field.draw(now);
  if (fields.some(field => field.visible && (field.spins || field.ambient || field.header || field.activeUntil > now))) wake();
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
    this.pointerStrength = 0; this.pointerTarget = 0; this.lastPointerFrame = 0;
    this.objectRotation = { yaw: 0, pitch: 0 }; this.objectDrag = null; this.objectGeometry = null;
    this.spinPhase = 0; this.lastSpinFrame = 0;
    this.navigationPointer = null;
    this.footer = canvas.id === 'footer-art'; this.pad = canvas.id === 'effect-art';
    this.walleLines = this.footer ? document.querySelector('.walle-art').textContent.split('\n') : [];
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
      const point = this.point(event);
      if (this.hitsObject(point)) {
        this.objectDrag = { start: point, origin: { ...this.objectRotation }, moved: false };
        canvas.setPointerCapture(event.pointerId); canvas.classList.add('dragging-object'); return;
      }
      this.pulse(point.x, point.y);
      if (event.pointerType === 'mouse' || this.pad) {
        this.down = true; this.previous = null; canvas.setPointerCapture(event.pointerId);
      }
    });
    canvas.addEventListener('pointermove', event => {
      this.pointer = this.point(event);
      if (this.objectDrag) {
        const dx = this.pointer.x - this.objectDrag.start.x, dy = this.pointer.y - this.objectDrag.start.y;
        this.objectDrag.moved ||= Math.hypot(dx, dy) > 4;
        if (this.objectDrag.moved) {
          this.objectRotation.yaw = this.objectDrag.origin.yaw + dx * .009;
          this.objectRotation.pitch = this.objectDrag.origin.pitch + dy * .009;
        }
        wake(); return;
      }
      canvas.dataset.overObject = String(this.hitsObject(this.pointer));
      if (this.down) this.paint(this.pointer);
      this.activeUntil = Math.max(this.activeUntil, performance.now() + 150); wake();
    });
    const finish = event => {
      if (this.objectDrag) {
        if (event.type === 'pointerup' && !this.objectDrag.moved) { const point = this.point(event); this.pulse(point.x, point.y); }
        this.objectDrag = null; canvas.classList.remove('dragging-object');
      }
      this.down = false; this.previous = null;
    };
    canvas.addEventListener('pointerup', finish); canvas.addEventListener('pointercancel', finish);
    canvas.addEventListener('lostpointercapture', finish);
    canvas.addEventListener('focus', wake); canvas.addEventListener('blur', wake);
    canvas.addEventListener('pointerleave', () => { this.pointer = null; this.activeUntil = Math.max(this.activeUntil, performance.now() + 100); wake(); });
    canvas.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); this.pulse(this.width * .65, this.height * .48); }
      if (this.spins && ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        this.objectRotation.yaw += event.key === 'ArrowLeft' ? -.12 : event.key === 'ArrowRight' ? .12 : 0;
        this.objectRotation.pitch += event.key === 'ArrowUp' ? -.12 : event.key === 'ArrowDown' ? .12 : 0;
        wake();
      }
    });
  }
  point(event) { const rect = this.canvas.getBoundingClientRect(); return { x: event.clientX - rect.left, y: event.clientY - rect.top }; }
  hitsObject(point) { return this.spins && this.objectGeometry && Math.hypot(point.x - this.objectGeometry.cx, point.y - this.objectGeometry.cy) < this.objectGeometry.size * 1.1; }
  pulse(x, y) {
    const time = performance.now(); this.events.push({ x, y, time, type: this.pad ? clickEffect : 'wave' });
    if (this.events.length > 6) this.events.shift();
    this.activeUntil = time + 2500; wake();
  }
  paint(point) {
    const previous = this.previous || point;
    const cell = this.footer ? (this.width < 700 ? 8 : 10) : this.pad ? 6 : 7;
    const rowHeight = this.footer ? Math.round(cell * 1.8) : cell;
    const steps = Math.ceil(Math.hypot(point.x - previous.x, point.y - previous.y) / 5) || 1;
    const expires = performance.now() + (reducedMotion.matches ? 250 : 2000);
    for (let i = 0; i <= steps; i++) {
      const x = Math.floor((previous.x + (point.x - previous.x) * i / steps) / cell);
      const y = Math.floor((previous.y + (point.y - previous.y) * i / steps) / rowHeight);
      if (x >= 0 && y >= 0 && x * cell < this.width && y * rowHeight < this.height) this.marks.set(`${x},${y}`, { x, y, expires });
    }
    while (this.marks.size > 1800) this.marks.delete(this.marks.keys().next().value);
    this.previous = point; this.activeUntil = expires + 100; wake();
  }
  objectField(now, cell) {
    const width = this.width, height = this.height, cols = Math.ceil(width / cell), rows = Math.ceil(height / cell);
    const light = new Float32Array(cols * rows), depth = new Float32Array(cols * rows).fill(-10);
    const narrow = width < 600 && !this.pad;
    const cx = this.pad ? width * .54 : narrow ? width * .55 : width / 2 + Math.min(width, 1500) * .25;
    const navigationHeight = this.spins ? document.querySelector('.site-header').offsetHeight : 0;
    const artHeight = height - navigationHeight;
    const cy = navigationHeight + artHeight * (narrow ? .68 : .46);
    const size = this.pad ? Math.min(width * .25, artHeight * .52) : narrow ? Math.min(width * .38, artHeight * .23) : Math.min(width * .25, artHeight * .42);
    const elapsed = Math.max(0, Math.min(100, now - (this.lastSpinFrame || now)));
    this.lastSpinFrame = now;
    if (!this.objectDrag) this.spinPhase += elapsed / (reducedMotion.matches ? 12000 : 3600);
    const angle = this.spinPhase + this.objectRotation.yaw;
    const ca = Math.cos(angle), sa = Math.sin(angle), tilt = .8 + this.objectRotation.pitch;
    const project = (x, y, z, value, outer = false) => {
      const outerAngle = .6 - this.spinPhase * .45 + this.objectRotation.yaw * .18;
      const cosine = outer ? Math.cos(outerAngle) : ca, sine = outer ? Math.sin(outerAngle) : sa;
      const axisTilt = outer ? .8 + Math.sin(this.spinPhase * .4) * .2 + this.objectRotation.pitch * .15 : tilt;
      const a = x * cosine + z * sine, b = -x * sine + z * cosine;
      const c = y * Math.cos(axisTilt) - b * Math.sin(axisTilt), d = y * Math.sin(axisTilt) + b * Math.cos(axisTilt);
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
          if (ring) project(x, z, y, .57 + .23 * Math.cos(u), true); else project(x, y, z, shade);
        }
      }
    }
    return { light, cols, cx, cy, size };
  }
  draw(now) {
    const ctx = this.ctx; if (!ctx) return;
    const width = this.width, height = this.height, style = getComputedStyle(document.body);
    const ink = style.getPropertyValue('--accent').trim(), copper = style.getPropertyValue('--copper').trim();
    ctx.clearRect(0, 0, width, height); ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 1;
    if (this.header || this.ambient) {
      const cell = this.header ? 8 : 16;
      const time = now / (reducedMotion.matches ? 9000 : 3000);
      const elapsed = Math.min(100, now - (this.lastPointerFrame || now));
      this.lastPointerFrame = now;
      this.pointerStrength += (this.pointerTarget - this.pointerStrength) * (1 - Math.exp(-elapsed / 150));
      for (let y = 4; y < height; y += cell) for (let x = 4; x < width; x += cell) {
        const distance = this.pointer ? Math.hypot(x - this.pointer.x, (y - this.pointer.y) * (this.header ? .5 : 1)) : 1000;
        const influence = Math.max(0, 1 - distance / (this.header ? 180 : 160)) * this.pointerStrength;
        const noise = .5 + .22 * Math.sin(x * .017 + y * .013 + time) + .18 * Math.sin(x * .005 - y * .019 - time * .7);
        const breath = .83 + .17 * Math.sin(time * .8);
        if (this.header) {
          const t = Math.max(0, Math.min(1, (y / height - .08) / .72));
          const fade = 1 - t * t * (3 - 2 * t);
          ctx.globalAlpha = (.14 + noise * .10 + influence * .28) * fade * breath;
        } else {
          const threshold = (bayer[(Math.floor(y / cell) % 4) * 4 + Math.floor(x / cell) % 4] + .5) / 16;
          ctx.globalAlpha = (noise > threshold ? .035 * breath : .008) + influence * .045;
        }
        if (ctx.globalAlpha > .005) cross(ctx, x, y, this.header ? 2 + influence * 2 : 2.5);
      }
      ctx.globalAlpha = 1; return;
    }
    this.events = this.events.filter(event => now - event.time < 2500);
    const cell = this.footer ? (width < 700 ? 8 : 10) : this.pad ? 6 : 7;
    const rowHeight = this.footer ? Math.round(cell * 1.8) : cell;
    const object = this.footer ? null : this.objectField(now, cell);
    if (object) this.objectGeometry = object;
    const walleColumn = Math.floor((width / cell - Math.max(0, ...this.walleLines.map(line => line.length))) / 2);
    const footerPointer = this.footer ? this.pointer || (document.activeElement === this.canvas ? { x: width / 2, y: 140 } : null) : null;
    const navigationHeight = this.spins ? document.querySelector('.site-header').offsetHeight : 0;
    if (this.spins) {
      const elapsed = Math.min(100, now - (this.lastPointerFrame || now)); this.lastPointerFrame = now;
      this.pointerStrength += (this.pointerTarget - this.pointerStrength) * (1 - Math.exp(-elapsed / 150));
    }
    ctx.font = `${this.footer ? Math.round(cell * 1.6) : cell + 1}px Departure, monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let y = 0, row = 0; y < height; y += rowHeight, row++) for (let x = 0, col = 0; x < width; x += cell, col++) {
      let value = object ? object.light[row * object.cols + col] || 0 : 0;
      const objectValue = value;
      if (this.spins) value = Math.max(value, .11 + .025 * Math.sin(x * .012 + y * .009 + now / 4000));
      let navigationFade = 1;
      if (y < navigationHeight) {
        const t = Math.max(0, Math.min(1, (y / navigationHeight - .08) / .72));
        navigationFade = 1 - t * t * (3 - 2 * t);
        const distance = this.navigationPointer ? Math.hypot(x - this.navigationPointer.x, (y - this.navigationPointer.y) * .5) : 1000;
        const influence = Math.max(0, 1 - distance / 180) * this.pointerStrength;
        const noise = .5 + .25 * Math.sin(x * .017 + y * .013 + now / 3000);
        value = Math.max(value, (.22 + noise * .15 + influence * .42) * navigationFade);
      }
      if (this.footer) value = .12 + .05 * Math.sin(x * .013) + .045 * Math.sin(y * .018 + x * .004);
      const literal = this.footer ? this.walleLines[row - 2]?.[col - walleColumn] : null;
      const revealDistance = footerPointer ? Math.hypot(x + cell / 2 - footerPointer.x, y + rowHeight / 2 - footerPointer.y) : Infinity;
      const reveal = Math.max(0, Math.min(1, (105 - revealDistance) / 20));
      const characterPart = literal && literal !== ' ' && reveal > .015;
      if (characterPart) value += (.88 - value) * reveal;
      for (const event of this.events) {
        if (event.type !== 'wave') continue;
        const age = (now - event.time) / 1000, distance = Math.hypot(x - event.x, y - event.y);
        const radius = age * 250;
        const envelope = Math.exp(-Math.pow((distance - radius) / 38, 2)) * Math.max(0, 1 - age / 2.5);
        const wave = Math.cos((distance - radius) / 10) * envelope;
        value += wave * .85 + envelope * .38;
      }
      const threshold = (bayer[(row % 4) * 4 + col % 4] + .5) / 16;
      const lens = this.pointer && Math.hypot(x - this.pointer.x, y - this.pointer.y) < 105;
      const characters = characterPart || renderMode === 'ascii' || (renderMode === 'hybrid' && !lens);
      ctx.fillStyle = characterPart ? '#ffffff' : ink; ctx.strokeStyle = ctx.fillStyle;
      const quietBackground = this.spins && objectValue < .08 && value < .18;
      ctx.globalAlpha = this.footer ? (characterPart ? .30 + .65 * reveal : .30) : quietBackground ? .055 : .88;
      const breathe = .035 * Math.sin(x * .013 + y * .017 + now / 1800);
      value += breathe * Math.min(1, value * 4);
      if (characters && value > .08) ctx.fillText(characterPart && value > .4 ? literal : glyphs[Math.min(glyphs.length - 1, Math.floor(Math.min(1, value) * glyphs.length))], x + cell / 2, y + rowHeight / 2);
      else if (!characters && value > threshold) cross(ctx, x + cell / 2, y + rowHeight / 2, cell - 3);
    }
    ctx.strokeStyle = copper; ctx.fillStyle = copper;
    for (const [key, mark] of this.marks) {
      if (mark.expires <= now) { this.marks.delete(key); continue; }
      ctx.globalAlpha = Math.min(1, (mark.expires - now) / 700); cross(ctx, mark.x * cell + cell / 2, mark.y * rowHeight + rowHeight / 2, cell - 3);
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
  const hero = fields.find(field => field.spins);
  if (hero) {
    const point = hero.point(event), inside = point.x >= 0 && point.y >= 0 && point.x < hero.width && point.y < hero.height;
    hero.pointer = inside ? point : null;
    const overNavigation = inside && point.y < document.querySelector('.site-header').offsetHeight;
    if (overNavigation) hero.navigationPointer = point;
    hero.pointerTarget = overNavigation ? 1 : 0;
  }
  for (const field of fields.filter(field => field.header || field.ambient)) {
    const point = field.point(event);
    const inside = point.x >= 0 && point.y >= 0 && point.x < field.width && point.y < field.height;
    if (inside) field.pointer = point;
    field.pointerTarget = inside ? 1 : 0;
    field.activeUntil = performance.now() + 100;
  }
  wake();
}, { passive: true });
document.addEventListener('pointerleave', () => { for (const field of fields) { field.pointerTarget = 0; field.pointer = null; } refreshFields(); });
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
document.getElementById('clear-drawing')?.addEventListener('click', () => { for (const field of fields) { field.events = []; field.marks.clear(); field.objectRotation = { yaw: 0, pitch: 0 }; } refreshFields(); });

const themeToggle = document.getElementById('theme-toggle');
themeToggle?.addEventListener('click', event => {
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
  if (document.startViewTransition) {
    document.documentElement.classList.add('theme-switching');
    const transition = document.startViewTransition(update);
    transition.finished.finally(() => document.documentElement.classList.remove('theme-switching'));
  } else {
    update();
    document.body.classList.add('theme-flash'); setTimeout(() => document.body.classList.remove('theme-flash'), 750);
  }
});
