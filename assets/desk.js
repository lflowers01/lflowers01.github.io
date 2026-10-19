'use strict';
const desk = document.querySelector('.desk-surface');
if (desk) {
  let saved = {}, layer = 4;
  try { saved = JSON.parse(localStorage.getItem('preview.desk.items.v1')) || {}; } catch { /* Optional storage. */ }
  const positions = {};
  const valid = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  const persist = () => { try { localStorage.setItem('preview.desk.items.v1', JSON.stringify(positions)); } catch { /* Keep this visit's arrangement. */ } };
  const items = [...desk.querySelectorAll('[data-desk-item]')];
  if (innerWidth < 700) {
    const notes = [[.03,.5],[.97,.67],[.2,.9]];
    desk.querySelectorAll('.sticky').forEach((note, i) => { note.dataset.x = notes[i][0]; note.dataset.y = notes[i][1]; });
    items[0].dataset.x = '.5'; items[0].dataset.y = '.04';
  }
  for (const item of items) {
    const id = item.dataset.deskItem, handle = item.querySelector('[data-desk-handle]') || item;
    positions[id] = valid(saved[id]) ? saved[id] : { x: Number(item.dataset.x), y: Number(item.dataset.y) };
    const range = () => ({ x: Math.max(1, desk.clientWidth - item.offsetWidth - 32), y: Math.max(1, desk.clientHeight - item.offsetHeight - 32) });
    item.place = () => { item.style.left = `${16 + range().x * positions[id].x}px`; item.style.top = `${16 + range().y * positions[id].y}px`; };
    let drag = null;
    handle.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      event.preventDefault(); handle.focus({ preventScroll: true }); handle.setPointerCapture(event.pointerId);
      item.style.zIndex = String(++layer); item.dataset.dragging = 'true';
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
      event.preventDefault(); const p = positions[id], step = event.shiftKey ? 2 : 10;
      positions[id] = { x: Math.max(0, Math.min(1, p.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0) / range().x)), y: Math.max(0, Math.min(1, p.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0) / range().y)) };
      item.place(); persist();
    });
  }
  new ResizeObserver(() => items.forEach(item => item.place())).observe(desk);
}
