'use strict';
const noteBoard = document.getElementById('note-board');
if (noteBoard) {
  const status = document.getElementById('board-status');
  const canvas = document.getElementById('note-drawing'), ctx = canvas.getContext('2d');
  const clear = document.getElementById('clear-drawing');
  let positions = {}, strokes = [], layer = 1, activeStroke = null;
  let cards = [...noteBoard.querySelectorAll('.sticky')];
  const storagePrefix = noteBoard.dataset.storagePrefix || '';
  function saved(key) { try { return JSON.parse(localStorage.getItem(storagePrefix + key)); } catch { return null; } }
  function persist(key, value) {
    try { localStorage.setItem(storagePrefix + key, JSON.stringify(value)); }
    catch { status.textContent = 'Browser storage is unavailable. Changes last for this visit.'; }
  }
  const validPoint = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  const storedPositions = saved('lf.board.positions.v1');
  if (storedPositions && typeof storedPositions === 'object' && !Array.isArray(storedPositions)) {
    for (const id of cards.map(c => c.dataset.id)) if (validPoint(storedPositions[id])) positions[id] = storedPositions[id];
  }
  const storedInk = saved('lf.notes.ink.v1');
  if (Array.isArray(storedInk) && storedInk.length <= 200 && storedInk.every(s => Array.isArray(s) && s.length && s.every(validPoint)) && storedInk.reduce((sum, s) => sum + s.length, 0) <= 6000) strokes = storedInk;
  const sandButton = document.getElementById('sand-toggle');
  const sand = sandButton ? new FallingSand(canvas, paintInk, data => persist('lf.notes.sand.v1', data)) : null;
  function updateSandButton() {
    if (!sandButton) return;
    sandButton.setAttribute('aria-pressed', String(sand.enabled));
    sandButton.setAttribute('aria-label', sand.enabled ? 'Return to drawing; let sand fall away' : 'Switch drawings to falling sand');
    canvas.dataset.sand = String(sand.enabled);
  }
  sandButton?.addEventListener('click', () => {
    activeStroke = null;
    if (!sand.enabled) {
      if (dissolving) { cancelAnimationFrame(dissolving); dissolving = 0; }
      for (const stroke of strokes) stroke.forEach((point, i) => segment(stroke[Math.max(0, i-1)], point, (x,y) => sand.grain(x,y)));
      strokes = []; persist('lf.notes.ink.v1', strokes);
    }
    sand.toggle(); updateSandButton();
  });
  function place(card) {
    const point = positions[card.dataset.id] || { x: Number(card.dataset.x), y: Number(card.dataset.y) };
    card.style.left = `${12 + Math.max(0, noteBoard.clientWidth - card.offsetWidth - 24) * point.x}px`;
    card.style.top = `${12 + Math.max(0, noteBoard.clientHeight - card.offsetHeight - 24) * point.y}px`;
  }
  function enhance(card) {
    const handle = card.querySelector('.note-handle'); handle.hidden = false;
    let drag = null;
    const point = () => positions[card.dataset.id] ||= { x: Number(card.dataset.x), y: Number(card.dataset.y) };
    handle.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault(); const value = point(), step = event.shiftKey ? .01 : .04;
      value.x = Math.max(0, Math.min(1, value.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0)));
      value.y = Math.max(0, Math.min(1, value.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0)));
      card.style.zIndex = String(++layer); place(card); persist('lf.board.positions.v1', positions);
    });
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); handle.focus(); point(); card.style.zIndex = String(++layer); card.dataset.dragging = 'true';
      drag = { x: event.clientX, y: event.clientY, left: parseFloat(card.style.left), top: parseFloat(card.style.top) }; handle.setPointerCapture(event.pointerId);
    });
    handle.addEventListener('pointermove', event => {
      if (!drag) return;
      positions[card.dataset.id] = { x: Math.max(0, Math.min(1, (drag.left + event.clientX - drag.x - 12) / Math.max(1, noteBoard.clientWidth - card.offsetWidth - 24))), y: Math.max(0, Math.min(1, (drag.top + event.clientY - drag.y - 12) / Math.max(1, noteBoard.clientHeight - card.offsetHeight - 24))) }; place(card);
    });
    const finish = () => { if (drag) { drag = null; card.dataset.dragging = 'false'; persist('lf.board.positions.v1', positions); } };
    for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(event, finish);
  }
  function segment(a, b, plot = (x, y) => ctx.fillRect(x, y, 4, 4)) {
    const width = noteBoard.clientWidth, height = noteBoard.clientHeight, ax = a.x * width, ay = a.y * height, bx = b.x * width, by = b.y * height;
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 2));
    for (let i = 0; i <= steps; i++) plot(Math.floor((ax + (bx - ax) * i / steps) / 4) * 4, Math.floor((ay + (by - ay) * i / steps) / 4) * 4);
  }
  function paintInk() {
    ctx.clearRect(0, 0, noteBoard.clientWidth, noteBoard.clientHeight); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    for (const stroke of strokes) stroke.forEach((point, index) => segment(stroke[Math.max(0, index - 1)], point));
  }
  function drawInk() { if (sand && (sand.enabled || sand.draining)) sand.render(); else paintInk(); }
  function addInk(event) {
    if (sand?.enabled) {
      if (sand.pour) { const rect = canvas.getBoundingClientRect(); sand.pour = {x:event.clientX-rect.left,y:event.clientY-rect.top}; sand.start(); }
      return;
    }
    if (!activeStroke || strokes.reduce((sum, s) => sum + s.length, 0) >= 6000) return;
    const rect = canvas.getBoundingClientRect(), point = { x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)), y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)) }, previous = activeStroke.at(-1);
    if (previous && Math.hypot((point.x - previous.x) * rect.width, (point.y - previous.y) * rect.height) < 3) return;
    activeStroke.push(point); ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim(); segment(previous || point, point);
  }
  canvas.addEventListener('pointerdown', event => { if (event.button !== 0) return; if (sand?.enabled) { event.preventDefault(); canvas.setPointerCapture(event.pointerId); const rect=canvas.getBoundingClientRect(); sand.pour={x:event.clientX-rect.left,y:event.clientY-rect.top}; sand.start(); return; } if (strokes.length >= 200) return; event.preventDefault(); if (dissolving) { cancelAnimationFrame(dissolving); dissolving = 0; drawInk(); } activeStroke = []; strokes.push(activeStroke); canvas.setPointerCapture(event.pointerId); addInk(event); });
  canvas.addEventListener('pointermove', addInk);
  const finishInk = () => { if (sand?.pour) { sand.pour = null; persist('lf.notes.sand.v1', sand.snapshot()); } if (activeStroke) { activeStroke = null; strokes = strokes.filter(s => s.length); persist('lf.notes.ink.v1', strokes); } };
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) canvas.addEventListener(event, finishInk);
  // Clearing dissolves the ink one 4px block at a time, in random order, accelerating toward the end.
  // Nothing moves (blocks vanish in place, like a fade), so it also runs under prefers-reduced-motion.
  let dissolving = 0;
  clear.addEventListener('click', () => {
    sand?.clear();
    const cells = new Map();
    for (const stroke of strokes) stroke.forEach((point, index) => segment(stroke[Math.max(0, index - 1)], point, (x, y) => cells.set(`${x},${y}`, [x, y])));
    activeStroke = null; strokes = []; persist('lf.notes.ink.v1', strokes); cancelAnimationFrame(dissolving); dissolving = 0;
    if (!cells.size) { drawInk(); return; }
    const order = [...cells.values()];
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
    const start = performance.now(); let done = 0;
    const step = now => {
      const t = Math.min(1, (now - start) / 700), target = Math.round(order.length * t * t);
      for (; done < target; done++) ctx.clearRect(order[done][0], order[done][1], 4, 4);
      dissolving = t < 1 ? requestAnimationFrame(step) : 0;
    };
    dissolving = requestAnimationFrame(step);
  });
  noteBoard.addEventListener('noteslayout', () => cards.forEach(place));
  if (sand) { sandButton.hidden = false; sand.restore(saved('lf.notes.sand.v1')); updateSandButton(); }
  noteBoard.classList.add('is-interactive'); canvas.hidden = clear.hidden = false; cards.forEach(enhance);
  new ResizeObserver(() => { const ratio = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(noteBoard.clientWidth * ratio); canvas.height = Math.round(noteBoard.clientHeight * ratio); ctx.setTransform(ratio, 0, 0, ratio, 0, 0); cards.forEach(place); sand?.resize(); drawInk(); }).observe(noteBoard);
  new MutationObserver(drawInk).observe(document.body, { attributes: true, attributeFilter: ['data-theme'] });
}
