'use strict';

const photoDrawer = document.querySelector('.photo-drawer');
if (photoDrawer) {
  const pool = JSON.parse(document.getElementById('photo-data').textContent);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const photoStorage = photoDrawer.dataset.storageKey || 'lf.photos.layout.v1';
  let saved = {}, layer = 1;
  try { saved = JSON.parse(localStorage.getItem(photoStorage)) || {}; } catch { /* Optional storage. */ }
  const positions = {};
  const valid = p => p && Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1;
  function persist() {
    try { localStorage.setItem(photoStorage, JSON.stringify(positions)); } catch { /* Positions still last for this visit. */ }
  }
  for (let slot = 0; slot < 3; slot++) if (valid(saved[slot])) positions[slot] = saved[slot];
  const focus = document.createElement('dialog'), close = document.createElement('button');
  const focusedImage = document.createElement('img'), focusedCaption = document.createElement('p');
  focus.className = 'photo-focus'; focus.setAttribute('aria-labelledby', 'photo-focus-caption');
  focusedCaption.id = 'photo-focus-caption';
  focusedImage.addEventListener('load', () => focus.style.setProperty('--photo-ratio', focusedImage.naturalWidth / focusedImage.naturalHeight));
  close.type = 'button'; close.className = 'photo-focus-close'; close.textContent = 'X';
  close.setAttribute('aria-label', 'Close photo'); close.autofocus = true;
  close.addEventListener('click', () => focus.close());
  focus.addEventListener('keydown', event => { if (event.key.toLowerCase() === 'x') focus.close(); });
  focus.append(close, focusedImage, focusedCaption); document.body.append(focus);
  const frames = pool.slice(0, 3).map((photo, slot) => {
    const frame = document.createElement('figure'), link = document.createElement('button');
    const image = document.createElement('img'), caption = document.createElement('figcaption');
    frame.dataset.photo = photo.id; frame.tabIndex = 0;
    frame.setAttribute('aria-label', `${photo.caption}. Move photo with arrow keys.`);
    image.src = photo.src; image.draggable = false;
    link.type = 'button'; link.className = 'photo-open'; link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', `View ${photo.caption}`);
    link.addEventListener('click', () => {
      focus.style.setProperty('--photo-ratio', image.naturalWidth / image.naturalHeight || .75);
      focusedImage.src = photo.src; focusedImage.alt = photo.alt; focusedCaption.textContent = photo.caption;
      focus.showModal();
    });
    image.alt = photo.alt; image.width = 250; image.height = 333; image.loading = 'lazy';
    caption.textContent = photo.caption; link.append(image); frame.append(link, caption);
    const range = () => ({ x: Math.max(1, photoDrawer.clientWidth - frame.offsetWidth - 24), y: Math.max(1, photoDrawer.clientHeight - frame.offsetHeight - 24) });
    const point = () => positions[slot] || { x: Math.max(0, Math.min(1, (frame.offsetLeft - 12) / range().x)), y: Math.max(0, Math.min(1, (frame.offsetTop - 12) / range().y)) };
    frame.place = () => {
      const p = positions[slot]; if (!p) return;
      frame.style.translate = `${12 + p.x * range().x - frame.offsetLeft}px ${12 + p.y * range().y - frame.offsetTop}px`;
    };
    let drag = null, suppressClick = false;
    frame.addEventListener('pointerdown', event => {
      if (event.button !== 0 || drag) return;
      suppressClick = false; frame.focus({ preventScroll: true });
      drag = { x: event.clientX, y: event.clientY, point: point(), moved: false };
      (event.target.closest('.photo-open') || frame).setPointerCapture(event.pointerId);
    });
    frame.addEventListener('pointermove', event => {
      if (!drag) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moved && Math.hypot(dx, dy) < 5) return;
      event.preventDefault(); drag.moved = true; frame.dataset.dragging = 'true'; frame.style.zIndex = String(++layer);
      positions[slot] = { x: Math.max(0, Math.min(1, drag.point.x + dx / range().x)), y: Math.max(0, Math.min(1, drag.point.y + dy / range().y)) };
      frame.place();
    });
    const finish = () => {
      if (!drag) return;
      suppressClick = drag.moved; drag = null; frame.dataset.dragging = 'false';
      if (suppressClick) persist();
    };
    for (const name of ['pointerup', 'pointercancel', 'lostpointercapture']) frame.addEventListener(name, finish);
    frame.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; } }, true);
    frame.addEventListener('keydown', event => {
      if (event.target !== frame || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault(); const p = point(), step = event.shiftKey ? 2 : 10;
      positions[slot] = { x: Math.max(0, Math.min(1, p.x + (event.key === 'ArrowRight' ? step : event.key === 'ArrowLeft' ? -step : 0) / range().x)), y: Math.max(0, Math.min(1, p.y + (event.key === 'ArrowDown' ? step : event.key === 'ArrowUp' ? -step : 0) / range().y)) };
      frame.style.zIndex = String(++layer); frame.place(); persist();
    });
    return frame;
  });
  photoDrawer.replaceChildren(...frames);
  new ResizeObserver(() => frames.forEach(frame => frame.place())).observe(photoDrawer);
}
