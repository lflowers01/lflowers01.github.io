'use strict';
const desk = document.querySelector('.desk-surface');
if (desk) {
  desk.addEventListener('pointerdown', () => desk.classList.add('pointer-drag-focus'));
  document.addEventListener('keydown', () => desk.classList.remove('pointer-drag-focus'));
  let saved = {}, layer = 4;
  try { saved = JSON.parse(localStorage.getItem('desk.items.v1')) || {}; } catch { /* Optional storage. */ }
  const positions = {};
  const valid = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  const persist = () => { try { localStorage.setItem('desk.items.v1', JSON.stringify(positions)); } catch { /* Keep this visit's arrangement. */ } };
  const items = [...desk.querySelectorAll('[data-desk-item]')];
  const ink = document.getElementById('note-drawing'), wave = document.getElementById('music-art');
  // The drawing canvas shares pointer effects with the waveform beneath it.
  for (const name of ['pointermove', 'pointerdown', 'pointerleave']) ink.addEventListener(name, event => wave.dispatchEvent(new PointerEvent(name, {clientX:event.clientX,clientY:event.clientY,button:event.button,pointerId:event.pointerId,pointerType:event.pointerType})));
  for (const item of items) {
    const id = item.dataset.deskItem, handle = item.querySelector('[data-desk-handle]') || item;
    positions[id] = valid(saved[id]) ? saved[id] : { x: Number(item.dataset.x), y: Number(item.dataset.y) };
    const range = () => ({ x: Math.max(1, desk.clientWidth - item.offsetWidth - 32), y: Math.max(1, desk.clientHeight - item.offsetHeight - 32) });
    item.place = () => { item.style.left = `${16 + range().x * positions[id].x}px`; item.style.top = `${16 + range().y * positions[id].y}px`; };
    let drag = null;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); handle.focus({ preventScroll: true }); handle.setPointerCapture(event.pointerId);
      item.style.zIndex = String(++layer); item.dataset.dragging = 'true'; item.dataset.moved = 'true';
      drag = { x: event.clientX, y: event.clientY, point: { ...positions[id] } };
    });
    handle.addEventListener('pointermove', event => {
      if (!drag) return;
      positions[id] = { x: Math.max(0, Math.min(1, drag.point.x + (event.clientX - drag.x) / range().x)), y: Math.max(0, Math.min(1, drag.point.y + (event.clientY - drag.y) / range().y)) };
      item.place();
    });
    const finish = () => { if (drag) { drag = null; item.dataset.dragging = 'false'; persist(); } };
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) handle.addEventListener(name, finish);
    handle.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault(); item.dataset.moved = 'true'; const p = positions[id], step = event.shiftKey ? 2 : 10;
      positions[id] = { x: Math.max(0, Math.min(1, p.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0) / range().x)), y: Math.max(0, Math.min(1, p.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0) / range().y)) };
      item.place(); persist();
    });
  }
  function layout() {
    const notes = [...desk.querySelectorAll('.sticky')], player = items[0], mobile = innerWidth <= 700;
    const gap = 28, width = Math.max(0, ...notes.map(note => note.offsetWidth)), height = Math.max(0, ...notes.map(note => note.offsetHeight));
    const left = mobile ? Math.max(12, (desk.clientWidth - width) / 2) : player.offsetWidth + 100;
    const top = mobile ? player.offsetHeight + 110 : 56;
    const columns = mobile ? 1 : Math.max(1, Math.min(2, Math.floor((desk.clientWidth - left - 20 + gap) / (width + gap))));
    const rows = Math.ceil(notes.length / columns);
    desk.style.height = `${Math.max(parseFloat(getComputedStyle(desk).getPropertyValue('--desk-height')), top + rows * (height + gap) + 160)}px`;
    if (mobile) { player.dataset.x = '.5'; player.dataset.y = '.035'; }
    else { player.dataset.x = '.04'; player.dataset.y = '.14'; }
    if (!valid(saved.ipod) && !player.dataset.moved) positions.ipod = {x:Number(player.dataset.x),y:Number(player.dataset.y)};
    notes.forEach((note, i) => {
      const x = left + i % columns * (width + gap), y = top + Math.floor(i / columns) * (height + gap);
      note.dataset.x = Math.max(0, Math.min(1, (x - 12) / Math.max(1, desk.clientWidth - note.offsetWidth - 24)));
      note.dataset.y = Math.max(0, Math.min(1, (y - 12) / Math.max(1, desk.clientHeight - note.offsetHeight - 24)));
    });
    desk.dispatchEvent(new Event('noteslayout'));
    items.forEach(item => item.place());
  }
  const observer = new ResizeObserver(layout); observer.observe(desk);
  desk.querySelectorAll('.sticky').forEach(note => observer.observe(note));
  document.fonts.ready.then(layout);
}
