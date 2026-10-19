'use strict';

// A fresh Blob URL gives each hover its own GIF decoder and restarts frame one.
const flowerBytes = fetch('/assets/plan/flower-grow.gif?speed=1.5').then(response => { if (!response.ok) throw new Error('Flower GIF unavailable'); return response.arrayBuffer(); });
flowerBytes.catch(() => {});
for (const trigger of document.querySelectorAll('.flower-trigger')) {
  const image = trigger.querySelector('[data-flower]');
  let hovered = false, active = false, completed = false, playbackURL = null, revision = 0, finishTimer;
  function stopFlower() {
    active = false; completed = false; revision++; clearTimeout(finishTimer); image.src = '/assets/plan/flower-original.png';
    if (playbackURL) { URL.revokeObjectURL(playbackURL); playbackURL = null; }
  }
  async function updateFlower() {
    if (!hovered && !trigger.matches(':focus-visible')) { if (!active || completed) stopFlower(); return; }
    if (active) return;
    active = true; const version = ++revision;
    try {
      const bytes = await flowerBytes;
      if (!active || version !== revision) return;
      playbackURL = URL.createObjectURL(new Blob([bytes], { type: 'image/gif' })); image.src = playbackURL;
      finishTimer = setTimeout(() => {
        completed = true;
        if (!hovered && !trigger.matches(':focus-visible')) stopFlower();
      }, 1050);
    } catch { stopFlower(); }
  }
  trigger.addEventListener('pointerenter', () => { hovered = true; updateFlower(); });
  trigger.addEventListener('pointerleave', () => { hovered = false; updateFlower(); });
  trigger.addEventListener('focus', updateFlower); trigger.addEventListener('blur', updateFlower);
}
