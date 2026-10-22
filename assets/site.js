'use strict';

async function loadCounter() {
  const output = document.getElementById('visit-count');
  if (!output) return;
  const status = document.getElementById('visit-status');
  const endpoint = document.body.dataset.counter;
  let countVisit = document.body.dataset.home === 'true';
  // A tab's first homepage visit counts; reloads fetch without incrementing.
  try { if (sessionStorage.getItem('lf.visit.v1')) countVisit = false; } catch { /* Server still limits repeats. */ }
  try {
    const response = await fetch(endpoint, { method: countVisit ? 'POST' : 'GET', headers: countVisit ? { 'Content-Type': 'application/json' } : {}, body: countVisit ? '{}' : undefined, signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error('Counter unavailable');
    const data = await response.json();
    if (!Number.isSafeInteger(data.visits) || data.visits < 0) throw new Error('Invalid counter');
    output.textContent = String(data.visits).padStart(6, '0');
    status.textContent = 'Accepted homepage visits, not unique people.';
    if (countVisit) try { sessionStorage.setItem('lf.visit.v1', '1'); } catch { /* Nonessential. */ }
  } catch {
    output.textContent = 'Unavailable'; status.textContent = 'The shared counter could not be reached.';
  }
}
loadCounter();

const badge = document.getElementById('site-badge');
badge?.addEventListener('click', () => {
  if (badge.classList.contains('is-turning')) return;
  const turn = () => {
    const flipped = badge.getAttribute('aria-pressed') !== 'true';
    badge.setAttribute('aria-pressed', String(flipped));
    badge.setAttribute('aria-label', flipped ? 'Welcome. Turn the site button back.' : 'Lucas Flowers site button. Turn it over.');
  };
  badge.classList.add('is-turning');
  setTimeout(turn, 160);
  setTimeout(() => badge.classList.remove('is-turning'), 320);
});
