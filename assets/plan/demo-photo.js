'use strict';

const photoCanvas = document.getElementById('photo-reveal');
const photoContext = photoCanvas.getContext('2d');
const portrait = new Image();
let photoPixels, photoDither, photoPoint = { x: 130, y: 150 };
let photoHover = false, photoKeyboard = false, photoProgress = 0, photoFrame = 0, photoHide;
let photoTarget = 0, photoFrom = 0, photoStart = 0;

function drawPhoto() {
  if (!photoContext || !photoPixels || !photoDither) return;
  const ctx = photoContext;
  ctx.putImageData(photoDither, 0, 0); ctx.imageSmoothingEnabled = false;
  if (photoProgress > 0) {
    ctx.font = '7px Departure,monospace'; ctx.fillStyle = '#c3cdb3';
    const reach = Math.hypot(260, 300);
    for (let y = 0; y < 300; y += 4) for (let x = 0; x < 260; x += 4) {
      const threshold = Math.hypot(x - photoPoint.x, y - photoPoint.y) / reach * .55 + (bayer[(y / 4 % 4) * 4 + x / 4 % 4] + .5) / 16 * .43;
      if (photoProgress > threshold) ctx.drawImage(photoPixels, x, y, 4, 4, x, y, 4, 4);
      if (!reducedMotion.matches && photoProgress < .98 && Math.abs(photoProgress - threshold) < .025) ctx.fillText(':+X'[(x + y) % 3], x, y + 4);
    }
  }
  if (photoHover && photoProgress < .98) {
    ctx.save(); ctx.beginPath(); ctx.arc(photoPoint.x, photoPoint.y, 48, 0, Math.PI * 2); ctx.clip();
    ctx.drawImage(photoPixels, 0, 0); ctx.restore();
  }
  photoCanvas.dataset.reveal = photoProgress >= .99 ? 'visible' : photoProgress <= .01 ? 'dither' : 'transition';
}
function animatePhoto(target) {
  if (photoTarget === target && photoFrame) return;
  cancelAnimationFrame(photoFrame); photoFrame = 0;
  photoTarget = target; photoFrom = photoProgress; photoStart = performance.now();
  if (reducedMotion.matches) { photoProgress = target; drawPhoto(); return; }
  const duration = target ? 850 : 1000;
  const step = now => {
    const t = Math.min(1, (now - photoStart) / duration), eased = t * t * (3 - 2 * t);
    photoProgress = photoFrom + (target - photoFrom) * eased; drawPhoto();
    photoFrame = t < 1 ? requestAnimationFrame(step) : 0;
  };
  photoFrame = requestAnimationFrame(step);
}
function hidePhotoLater(delay = 1200) {
  clearTimeout(photoHide);
  photoHide = setTimeout(() => { if (!photoHover && !photoKeyboard) animatePhoto(0); }, delay);
}
portrait.onload = () => {
  const original = document.createElement('canvas'); original.width = 65; original.height = 75;
  const small = original.getContext('2d'); if (!small) return;
  const scale = Math.max(65 / portrait.naturalWidth, 75 / portrait.naturalHeight);
  small.drawImage(portrait, (65 - portrait.naturalWidth * scale) / 2, (75 - portrait.naturalHeight * scale) / 2, portrait.naturalWidth * scale, portrait.naturalHeight * scale);
  photoPixels = document.createElement('canvas'); photoPixels.width = 260; photoPixels.height = 300;
  const pixels = photoPixels.getContext('2d'); if (!pixels) return;
  pixels.imageSmoothingEnabled = false; pixels.drawImage(original, 0, 0, 260, 300);
  photoDither = pixels.getImageData(0, 0, 260, 300);
  for (let y = 0; y < 300; y++) for (let x = 0; x < 260; x++) {
    const index = (y * 260 + x) * 4;
    const light = (photoDither.data[index] * .2126 + photoDither.data[index + 1] * .7152 + photoDither.data[index + 2] * .0722) / 255;
    const threshold = (bayer[(Math.floor(y / 2) % 4) * 4 + Math.floor(x / 2) % 4] + .5) / 16;
    const value = light > threshold ? 232 : 0;
    photoDither.data[index] = photoDither.data[index + 1] = photoDither.data[index + 2] = value;
  }
  drawPhoto();
};
portrait.onerror = () => { if (photoContext) { photoContext.fillStyle = '#ddd'; photoContext.font = '12px sans-serif'; photoContext.fillText('Portrait unavailable', 20, 150); } };
portrait.src = 'assets/plan/portrait-original.png';
photoCanvas.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') photoHover = true; clearTimeout(photoHide); drawPhoto(); });
photoCanvas.addEventListener('pointermove', event => {
  if (photoProgress > .01) return;
  const rect = photoCanvas.getBoundingClientRect();
  photoPoint = { x: (event.clientX - rect.left) * 260 / rect.width, y: (event.clientY - rect.top) * 300 / rect.height }; drawPhoto();
});
photoCanvas.addEventListener('pointerleave', () => { photoHover = false; drawPhoto(); hidePhotoLater(); });
photoCanvas.addEventListener('click', () => { clearTimeout(photoHide); animatePhoto(1); if (!photoHover && !photoKeyboard) hidePhotoLater(2600); });
photoCanvas.addEventListener('focus', () => { if (photoCanvas.matches(':focus-visible')) { photoKeyboard = true; clearTimeout(photoHide); animatePhoto(1); } });
photoCanvas.addEventListener('blur', () => { photoKeyboard = false; hidePhotoLater(); });
photoCanvas.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); clearTimeout(photoHide); animatePhoto(1); } });
reducedMotion.addEventListener('change', () => { cancelAnimationFrame(photoFrame); photoFrame = 0; photoProgress = photoTarget; drawPhoto(); });

// A fresh Blob URL gives each hover its own GIF decoder and restarts frame one.
const flowerBytes = fetch('assets/plan/flower-grow.gif').then(response => { if (!response.ok) throw new Error('Flower GIF unavailable'); return response.arrayBuffer(); });
flowerBytes.catch(() => {});
for (const trigger of document.querySelectorAll('.flower-trigger')) {
  const image = trigger.querySelector('[data-flower]');
  let hovered = false, active = false, playbackURL = null, revision = 0;
  function stopFlower() {
    active = false; revision++; image.src = 'assets/plan/flower-original.png';
    if (playbackURL) { URL.revokeObjectURL(playbackURL); playbackURL = null; }
  }
  async function updateFlower() {
    if (!hovered && !trigger.matches(':focus-visible')) { stopFlower(); return; }
    if (active) return;
    active = true; const version = ++revision;
    try {
      const bytes = await flowerBytes;
      if (!active || version !== revision) return;
      playbackURL = URL.createObjectURL(new Blob([bytes], { type: 'image/gif' })); image.src = playbackURL;
    } catch { stopFlower(); }
  }
  trigger.addEventListener('pointerenter', () => { hovered = true; updateFlower(); });
  trigger.addEventListener('pointerleave', () => { hovered = false; updateFlower(); });
  trigger.addEventListener('focus', updateFlower); trigger.addEventListener('blur', updateFlower);
}
