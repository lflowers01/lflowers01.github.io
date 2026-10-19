'use strict';

class FallingSand {
  constructor(canvas, paintInk, save) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.paintInk = paintInk; this.save = save;
    this.audioTarget = 0; this.audioEnergy = 0; this.shakeBudget = 0;
    document.addEventListener('audio-waveform', event => { this.audioTarget = Number.isFinite(event.detail) ? Math.max(0, Math.min(1, event.detail)) : 0; if (this.enabled && this.audioTarget > .08 && this.grid.some(Boolean)) this.start(); });
    this.enabled = false; this.draining = false; this.frame = 0; this.pour = null;
    this.resize();
  }
  resize() {
    const cols = Math.max(1, Math.floor(this.canvas.parentElement.clientWidth / 4));
    const rows = Math.max(1, Math.floor(this.canvas.parentElement.clientHeight / 4));
    if (cols === this.cols && rows === this.rows) return;
    const old = this.grid, oldCols = this.cols, oldRows = this.rows;
    this.cols = cols; this.rows = rows; this.grid = new Uint8Array(cols * rows);
    if (old) for (let i = 0; i < old.length; i++) if (old[i]) this.grid[Math.min(rows-1, Math.floor(Math.floor(i / oldCols) * rows / oldRows)) * cols + Math.min(cols-1, Math.floor((i % oldCols) * cols / oldCols))] = 1;
    if (this.enabled || this.draining) this.start();
  }
  restore(data) {
    if (!data || data.enabled !== true || !Number.isInteger(data.cols) || !Number.isInteger(data.rows) || data.cols < 1 || data.rows < 1 || data.cols * data.rows > 1000000 || typeof data.cells !== 'string' || data.cells.length !== data.cols * data.rows || /[^01]/.test(data.cells)) return false;
    for (let i = 0; i < data.cells.length; i++) if (data.cells[i] === '1') this.grid[Math.min(this.rows-1, Math.floor(Math.floor(i / data.cols) * this.rows / data.rows)) * this.cols + Math.min(this.cols-1, Math.floor((i % data.cols) * this.cols / data.cols))] = 1;
    this.enabled = true; this.start(); return true;
  }
  snapshot() { return {enabled:this.enabled, cols:this.cols, rows:this.rows, cells:this.enabled ? this.grid.join('') : ''}; }
  grain(x, y) {
    const col = Math.floor(x / 4), row = Math.floor(y / 4);
    if (col >= 0 && col < this.cols && row >= 0 && row < this.rows) this.grid[row * this.cols + col] = 1;
  }
  toggle() {
    this.enabled = !this.enabled; this.draining = !this.enabled; this.pour = null;
    this.save(this.snapshot()); this.start();
  }
  clear() {
    this.grid.fill(0); this.pour = null; this.draining = false;
    this.save(this.snapshot()); this.render();
  }
  render() {
    this.paintInk(); this.ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--accent').trim();
    for (let y = 0; y < this.rows; y++) {
      let start = -1;
      for (let x = 0; x <= this.cols; x++) {
        const occupied = x < this.cols && this.grid[y * this.cols + x];
        if (occupied && start < 0) start = x;
        if (!occupied && start >= 0) { this.ctx.fillRect(start * 4, y * 4, (x-start) * 4, 4); start = -1; }
      }
    }
  }
  advance(dt) {
    let active = false;
    if (this.enabled && this.pour) {
      this.pourBudget = (this.pourBudget || 0) + 220 * dt;
      while (this.pourBudget >= 1) { this.grain(this.pour.x + (Math.random()-.5)*24, this.pour.y + (Math.random()-.5)*12); this.pourBudget--; }
    }
    for (let y = this.rows-1; y >= 0; y--) for (let n = 0; n < this.cols; n++) {
      const x = (y % 2) ? n : this.cols-1-n, from = y*this.cols+x;
      if (!this.grid[from]) continue;
      let to = -1;
      if (y === this.rows-1) { if (this.draining) to = this.grid.length; }
      else if (!this.grid[from+this.cols]) to = from+this.cols;
      else {
        const direction = Math.random()<.5 ? -1 : 1;
        if (x+direction >= 0 && x+direction < this.cols && !this.grid[from+this.cols+direction]) to = from+this.cols+direction;
        else if (x-direction >= 0 && x-direction < this.cols && !this.grid[from+this.cols-direction]) to = from+this.cols-direction;
      }
      if (to < 0) continue;
      active = true;
      // Independent grain movement prevents whole rows accelerating as rigid sheets.
      if (Math.random() < .78) { this.grid[from] = 0; if (to < this.grid.length) this.grid[to] = 1; }
    }
    this.audioEnergy += (this.audioTarget-this.audioEnergy) * (1-Math.exp(-dt*4));
    // SoundCloud supplies amplitude, not PCM. Slow envelope energy is a bass-like proxy.
    const drive = Math.max(0, this.audioEnergy - Math.abs(this.audioTarget-this.audioEnergy)*.8);
    if (this.enabled && drive > .08 && this.grid.some(Boolean)) {
      active = true; this.shakeBudget += drive*drive*24*dt;
      while (this.shakeBudget >= 1) {
        this.shakeBudget--;
        const x = Math.floor(Math.random()*this.cols);
        for (let y = 1; y < this.rows; y++) if (this.grid[y*this.cols+x]) {
          const direction = Math.random()<.5 ? -1 : 1;
          const col = Math.max(0, Math.min(this.cols-1, x+direction));
          const row = Math.max(0, y-2-Math.floor(drive*2)), to = row*this.cols+col;
          if (!this.grid[to]) { this.grid[y*this.cols+x] = 0; this.grid[to] = 1; }
          break;
        }
      }
    }
    return active || Boolean(this.pour);
  }
  start() {
    if (this.frame) return;
    let previous = performance.now(), accumulator = 0, active = true;
    const tick = 1/120;
    const step = now => {
      // Fixed physics ticks keep falling and pouring identical at 30, 60 or 144 Hz.
      accumulator += Math.max(0, Math.min(.1, (now-previous)/1000)); previous = now;
      while (accumulator + 1e-9 >= tick) { active = this.advance(tick); accumulator = Math.max(0, accumulator - tick); if (!active) break; }
      this.render();
      if (active) this.frame = requestAnimationFrame(step);
      else { this.frame = 0; if (!this.grid.some(Boolean)) this.draining = false; this.save(this.snapshot()); }
    };
    this.frame = requestAnimationFrame(step);
  }
}
