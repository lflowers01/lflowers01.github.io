'use strict';

const dap = document.querySelector('.dap');
if (dap) {
  const defaultTracks = JSON.parse(document.getElementById('music-data').textContent);
  let tracks = defaultTracks, pendingSource = null;
  const play = document.getElementById('music-play');
  const seek = document.getElementById('music-seek');
  const volume = document.getElementById('music-volume');
  const state = document.getElementById('music-state');
  const status = document.getElementById('music-status');
  const previous = document.getElementById('music-prev');
  const next = document.getElementById('music-next');
  const shuffleToggle = document.getElementById('music-shuffle');
  const bars = [...document.querySelectorAll('.dap-meter i')];
  const cover = document.getElementById('music-cover');
  const select = document.getElementById('music-select');
  const menu = document.getElementById('music-menu'), settings = document.getElementById('music-settings');
  const sourceLink = document.querySelector('.music-source'), defaultSource = sourceLink.href, defaultLabel = sourceLink.textContent;
  const linkForm = document.getElementById('music-link'), linkStatus = document.getElementById('music-link-status');
  let current = 0, widget = null, duration = 0, lastPosition = 0, loading = false, timeout, playbackTimeout;
  let shuffle = false, bag = [], history = [0], historyPosition = 0;
  let waveform = null, waveformRequest = null, waveformRetry;
  let seekTarget = null, seekTime = 0;
  const clock = milliseconds => `${Math.floor(milliseconds / 60000)}:${String(Math.floor(milliseconds / 1000) % 60).padStart(2, '0')}`;
  const trackUrl = () => `https://api.soundcloud.com/tracks/${tracks[current].id}`;
  const views = { playing: document.getElementById('music-now-playing'), menu: document.getElementById('music-main-menu'), songs: document.getElementById('music-track-list'), extras: document.getElementById('music-extras'), link: linkForm, settings };
  const wheel = document.querySelector('.ipod-wheel');
  let screen = 'playing', selectedRow = 0, scrubbing = false, wheelAngle = null, wheelTravel = 0;
  function rows() { return [...views[screen].querySelectorAll('button:not(:disabled),a[href]')]; }
  function highlight(index, focus = false) {
    const items = rows(); if (!items.length) return;
    selectedRow = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((item, i) => item.classList.toggle('ipod-selected', i === selectedRow));
    items[selectedRow].scrollIntoView({ block: 'nearest' });
    if (focus) items[selectedRow].focus({ preventScroll: true });
  }
  function showScreen(value) {
    screen = value; selectedRow = 0;
    for (const [name, panel] of Object.entries(views)) panel.hidden = name !== value;
    document.getElementById('music-screen-title').textContent = { playing: 'Now Playing', menu: 'iPod', songs: 'Music', extras: 'Extras', link: 'SoundCloud', settings: 'Settings' }[value];
    menu.setAttribute('aria-expanded', String(value !== 'playing'));
    select.setAttribute('aria-label', value === 'playing' ? `Switch wheel to ${scrubbing ? 'volume' : 'seeking'}` : 'Select menu item');
    if (value !== 'playing') highlight(0);
  }
  menu.addEventListener('click', () => showScreen(screen === 'playing' ? 'menu' : screen === 'menu' ? 'playing' : 'menu'));
  for (const button of dap.querySelectorAll('[data-ipod-view]')) button.addEventListener('click', () => showScreen(button.dataset.ipodView));
  dap.addEventListener('keydown', event => { if (event.key === 'Escape' && screen !== 'playing') { showScreen(screen === 'menu' ? 'playing' : 'menu'); menu.focus(); } });
  select.addEventListener('click', () => {
    if (screen !== 'playing') rows()[selectedRow]?.click();
    else { scrubbing = !scrubbing; dap.dataset.scrubbing = String(scrubbing); showScreen('playing'); }
  });
  function renderSongs() {
    views.songs.replaceChildren();
    tracks.forEach((track, index) => {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = track.title;
      button.addEventListener('click', () => { if (loading) return; current = index; bag = []; history = [current]; historyPosition = 0; showScreen('playing'); playCurrent(); });
      views.songs.append(button);
    });
  }
  renderSongs();
  for (const panel of Object.values(views)) panel.addEventListener('focusin', event => { const index = rows().indexOf(event.target); if (index >= 0) highlight(index); });
  function publicSoundCloudUrl(value) {
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    if (url.protocol === 'http:') url.protocol = 'https:';
    if (url.protocol !== 'https:' || !['soundcloud.com', 'www.soundcloud.com'].includes(url.hostname) || url.username || url.password || url.port || url.pathname === '/' || url.pathname.startsWith('/discover/')) throw new Error('Use a public SoundCloud track or playlist URL.');
    url.hash = ''; return url.href;
  }
  function setSource(url, label) { sourceLink.href = url; sourceLink.textContent = label; document.querySelector('#music-extras a').href = url; }
  linkForm.addEventListener('submit', event => {
    event.preventDefault(); if (loading) return;
    try { pendingSource = publicSoundCloudUrl(document.getElementById('music-url').value.trim()); }
    catch { linkStatus.textContent = 'Use a public SoundCloud track or playlist URL.'; return; }
    linkStatus.textContent = 'Loading…'; clearWaveform(); setPlaying(false);
    if (widget) { startTimeout(); widget.load(pendingSource, { auto_play: false, start_track: 0, callback: ready }); }
    else start();
  });
  document.getElementById('music-default').addEventListener('click', () => {
    if (loading) return; pendingSource = null; tracks = defaultTracks; current = 0; bag = []; history = [0]; historyPosition = 0;
    setSource(defaultSource, defaultLabel); renderSongs(); showScreen('playing'); playCurrent();
  });
  document.getElementById('music-backlight').addEventListener('click', event => {
    const enabled = dap.dataset.backlight === 'false'; dap.dataset.backlight = String(enabled); event.currentTarget.setAttribute('aria-pressed', String(enabled));
  });
  function turnWheel(delta) {
    if (screen === 'menu' || screen === 'songs' || screen === 'extras') {
      wheelTravel += delta;
      if (Math.abs(wheelTravel) > .23) { highlight(selectedRow + Math.sign(wheelTravel)); wheelTravel = 0; }
    } else {
      const control = scrubbing && screen === 'playing' ? seek : volume;
      if (control.disabled) return;
      control.value = Math.max(0, Math.min(Number(control.max), Number(control.value) + delta * (control === seek ? 140 : 22)));
      control.dispatchEvent(new Event(control === seek ? 'change' : 'input', { bubbles: true }));
    }
  }
  const angleAt = event => { const rect = wheel.getBoundingClientRect(); return Math.atan2(event.clientY - rect.top - rect.height / 2, event.clientX - rect.left - rect.width / 2); };
  wheel.addEventListener('pointerdown', event => { if (event.button || event.target.closest('button')) return; event.preventDefault(); wheelAngle = angleAt(event); wheelTravel = 0; wheel.setPointerCapture(event.pointerId); });
  wheel.addEventListener('pointermove', event => { if (wheelAngle === null) return; const angle = angleAt(event); turnWheel(Math.atan2(Math.sin(angle - wheelAngle), Math.cos(angle - wheelAngle))); wheelAngle = angle; });
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) wheel.addEventListener(event, () => { wheelAngle = null; });
  wheel.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); turnWheel(event.key === 'ArrowDown' ? .3 : -.3); }
    if (event.target === wheel && ['Enter', ' '].includes(event.key)) { event.preventDefault(); select.click(); }
  });
  function setPlaying(playing) {
    dap.dataset.playing = String(playing);
    play.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    document.getElementById('music-playback-indicator').textContent = playing ? '▶' : 'Ⅱ';
    state.textContent = playing ? 'Playing' : 'Paused';
    if (!playing) document.dispatchEvent(new CustomEvent('audio-waveform', { detail: 0 }));
  }
  function busy(value) {
    loading = value;
    for (const button of [play, previous, next]) button.disabled = value;
    previous.disabled = value || (shuffle && historyPosition === 0);
    shuffleToggle.disabled = value || tracks.length < 2;
    document.getElementById('music-load').disabled = document.getElementById('music-default').disabled = value;
    dap.setAttribute('aria-busy', String(value));
  }
  function failed() {
    if (pendingSource) { pendingSource = null; linkStatus.textContent = 'That link could not be loaded. Try a public track or playlist.'; }
    clearTimeout(timeout); clearTimeout(playbackTimeout); busy(false); setPlaying(false); seek.disabled = true;
    state.textContent = 'Unavailable';
    status.textContent = 'SoundCloud could not start playback in this browser. Try another track or open the station below.';
    if (widget) {
      for (const event of Object.values(SC.Widget.Events)) widget.unbind(event);
      widget.pause(); widget = null;
    }
    dap.querySelector('iframe')?.remove();
    clearWaveform();
  }
  function clearWaveform() {
    clearTimeout(waveformRetry);
    waveformRequest?.abort(); waveformRequest = null; waveform = null;
    for (const bar of bars) bar.style.height = '3px';
    cover.hidden = true;
    document.dispatchEvent(new CustomEvent('audio-waveform', { detail: 0 }));
    document.dispatchEvent(new CustomEvent('music-waveform', { detail: null }));
  }
  function drawMeter(position) {
    if (!waveform || !duration) return;
    const center = position / duration * (waveform.length - 1);
    document.dispatchEvent(new CustomEvent('music-waveform', { detail: { samples: waveform, progress: Math.max(0, Math.min(1, position / duration)) } }));
    bars.forEach((bar, index) => {
      const point = Math.max(0, Math.min(waveform.length - 1, center + index - (bars.length - 1) / 2));
      const left = Math.floor(point), right = Math.min(waveform.length - 1, left + 1);
      const amplitude = waveform[left] + (waveform[right] - waveform[left]) * (point - left);
      bar.style.height = `${12 + Math.round(amplitude * 88)}%`;
    });
    if (dap.dataset.playing === 'true') document.dispatchEvent(new CustomEvent('audio-waveform', { detail: waveform[Math.round(Math.max(0, Math.min(waveform.length - 1, center)))] }));
  }
  function loadTrackVisuals(activeWidget, trackId, attempt = 0) {
    const stillCurrent = () => widget === activeWidget && tracks[current].id === trackId;
    const retry = () => { if (attempt < 2 && stillCurrent()) { clearTimeout(waveformRetry); waveformRetry = setTimeout(() => loadTrackVisuals(activeWidget, trackId, attempt + 1), 600 * (attempt + 1)); } };
    activeWidget.getCurrentSound(async sound => {
      if (!stillCurrent()) return;
      if (!sound || (sound.id && sound.id !== trackId)) { retry(); return; }
      try {
        const artwork = new URL(sound.artwork_url);
        if (artwork.protocol === 'https:' && artwork.hostname.endsWith('.sndcdn.com')) {
          const image = new Image();
          image.onload = () => {
            if (widget !== activeWidget || tracks[current].id !== trackId) return;
            cover.getContext('2d').drawImage(image, 0, 0, 40, 40);
            cover.setAttribute('aria-label', `Cover artwork for ${tracks[current].title} by ${tracks[current].artist}`);
            cover.hidden = false;
          };
          image.src = artwork.href;
        }
      } catch { /* Some tracks have no cover artwork. */ }
      try {
        const url = new URL(sound.waveform_url);
        if (url.protocol !== 'https:' || !url.hostname.endsWith('.sndcdn.com') || !url.pathname.endsWith('.json')) return;
        // Some full tracks expose a 30-second preview in duration; full_duration matches playback.
        const waveformDuration = sound.full_duration || sound.duration;
        if (!Number.isFinite(waveformDuration) || Math.abs(waveformDuration - duration) > Math.max(1000, duration * .02)) return;
        waveformRequest?.abort(); const request = waveformRequest = new AbortController();
        const response = await fetch(url, { signal: request.signal, credentials: 'omit' });
        if (!response.ok) { retry(); return; }
        const data = await response.json();
        if (request.signal.aborted || widget !== activeWidget || tracks[current].id !== trackId) return;
        if (!Number.isFinite(data.height) || data.height <= 0 || !Array.isArray(data.samples) || !data.samples.length || data.samples.length > 20000 || !data.samples.every(value => Number.isFinite(value) && value >= 0 && value <= data.height)) return;
        waveform = data.samples.map(value => value / data.height);
        drawMeter(lastPosition);
      } catch { retry(); /* Audio can still play when its public waveform is unavailable. */ }
    });
  }
  function updateTrack() {
    seekTarget = null; seekTime = 0;
    clearWaveform();
    document.getElementById('music-title').textContent = tracks[current].title;
    document.getElementById('music-artist').textContent = tracks[current].artist;
    document.getElementById('music-artist').href = tracks[current].url;
    document.getElementById('music-index').textContent = `${String(current + 1).padStart(2, '0')} / ${String(tracks.length).padStart(2, '0')}`;
    document.getElementById('music-time').textContent = '0:00';
    document.getElementById('music-duration').textContent = '—:—';
    duration = 0; lastPosition = 0; seek.value = 0; seek.disabled = true;
  }
  function loadApi() {
    if (window.SC?.Widget) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'https://w.soundcloud.com/player/api.js';
      const timer = setTimeout(() => { script.remove(); reject(new Error('SoundCloud timed out')); }, 12000);
      script.onload = () => { clearTimeout(timer); resolve(); };
      script.onerror = () => { clearTimeout(timer); script.remove(); reject(new Error('SoundCloud unavailable')); };
      document.head.append(script);
    });
  }
  function startTimeout() {
    clearTimeout(timeout); timeout = setTimeout(failed, 18000);
    busy(true); state.textContent = 'Connecting'; status.textContent = 'Connecting to SoundCloud…';
  }
  function watchPlayback() {
    clearTimeout(playbackTimeout);
    playbackTimeout = setTimeout(() => widget?.getPosition(position => { if (!position) failed(); }), 12000);
  }
  function ready() {
    if (!widget) return;
    if (pendingSource) {
      const activeWidget = widget, source = pendingSource;
      const accept = sounds => {
        if (widget !== activeWidget || pendingSource !== source) return;
        try {
          if (!Array.isArray(sounds) || !sounds.length || sounds.length > 500) throw new Error('Invalid playlist');
          const imported = sounds.map(sound => {
            if (!Number.isSafeInteger(sound.id) || sound.id <= 0 || typeof sound.title !== 'string' || !sound.title.trim()) throw new Error('Invalid track');
            return { id: sound.id, title: sound.title.slice(0, 200), artist: String(sound.user?.username || 'SoundCloud').slice(0, 200), url: publicSoundCloudUrl(sound.user?.permalink_url || source) };
          });
          activeWidget.getCurrentSound(sound => {
            if (widget !== activeWidget || pendingSource !== source) return;
            tracks = imported; current = Math.max(0, tracks.findIndex(track => track.id === sound?.id)); bag = []; history = [current]; historyPosition = 0; pendingSource = null;
            setSource(source, 'Open selection on SoundCloud ↗'); renderSongs(); updateTrack(); showScreen('playing'); linkStatus.textContent = ''; ready();
          });
        } catch { failed(); }
      };
      activeWidget.getSounds(sounds => { if (Array.isArray(sounds) && sounds.length) accept(sounds); else activeWidget.getCurrentSound(sound => accept(sound ? [sound] : [])); });
      return;
    }
    clearTimeout(timeout); busy(false);
    const activeWidget = widget, trackId = tracks[current].id;
    widget.setVolume(Number(volume.value));
    widget.getDuration(value => {
      if (widget !== activeWidget || tracks[current].id !== trackId) return;
      duration = Number.isFinite(value) && value > 0 ? value : 0;
      seek.disabled = !duration; document.getElementById('music-duration').textContent = clock(duration);
      loadTrackVisuals(activeWidget, trackId);
    });
    state.textContent = 'Ready'; status.textContent = 'Press play if your browser paused playback.';
    widget.play(); watchPlayback();
  }
  async function start() {
    startTimeout();
    try {
      await loadApi();
      if (!loading) return;
      const iframe = document.createElement('iframe');
      iframe.className = 'soundcloud-engine'; iframe.title = 'SoundCloud audio playback';
      iframe.allow = 'autoplay; encrypted-media'; iframe.tabIndex = -1; iframe.setAttribute('aria-hidden', 'true');
      iframe.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(pendingSource || trackUrl())}&auto_play=false&show_artwork=false&visual=false`;
      dap.append(iframe); widget = SC.Widget(iframe);
      widget.bind(SC.Widget.Events.READY, ready);
      widget.bind(SC.Widget.Events.PLAY, () => { if (pendingSource) return; clearTimeout(timeout); busy(false); setPlaying(true); status.textContent = 'Audio via SoundCloud. Availability and ads depend on the track.'; });
      widget.bind(SC.Widget.Events.PAUSE, () => setPlaying(false));
      widget.bind(SC.Widget.Events.PLAY_PROGRESS, event => {
        if (!Number.isFinite(event.currentPosition) || event.currentPosition < 0) return;
        lastPosition = event.currentPosition;
        if (event.currentPosition > 0) clearTimeout(playbackTimeout);
        if (!duration) return;
        seek.value = Math.min(1000, Math.max(0, event.currentPosition / duration * 1000));
        document.getElementById('music-time').textContent = clock(event.currentPosition);
        drawMeter(Math.min(duration, event.currentPosition));
      });
      widget.bind(SC.Widget.Events.FINISH, () => {
        if (loading) return;
        const tolerance = Math.min(1200, duration * .02);
        const seekingMiddle = seekTarget !== null && performance.now() - seekTime < 2500 && seekTarget < duration - tolerance;
        if (duration && lastPosition >= duration - tolerance && !seekingMiddle) change(1);
        else if (seekingMiddle) {
          const activeWidget = widget;
          activeWidget.isPaused(paused => { if (widget === activeWidget && paused) { setPlaying(false); status.textContent = 'SoundCloud paused while seeking. Press play to resume.'; } });
        } else if (lastPosition <= 500) failed();
        else {
          setPlaying(false); status.textContent = 'SoundCloud stopped before the end of this track. Resume playback or choose another track.';
        }
      });
      widget.bind(SC.Widget.Events.ERROR, failed);
    } catch { failed(); }
  }
  function change(direction) {
    if (loading) return;
    if (shuffle) {
      if (direction < 0) {
        if (historyPosition === 0) return;
        current = history[--historyPosition];
      } else if (historyPosition < history.length - 1) current = history[++historyPosition];
      else {
        if (!bag.length) {
          bag = tracks.map((_, index) => index).filter(index => index !== current);
          for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
          }
        }
        current = bag.pop() ?? current;
        history.push(current); historyPosition++;
      }
    } else current = (current + direction + tracks.length) % tracks.length;
    playCurrent();
  }
  function playCurrent() {
    updateTrack(); setPlaying(false);
    if (widget) { startTimeout(); widget.load(trackUrl(), { auto_play: true, show_artwork: false, callback: ready }); }
    else start();
  }
  play.addEventListener('click', () => {
    if (loading) return;
    if (!widget) start();
    else if (dap.dataset.playing === 'true') { clearTimeout(playbackTimeout); widget.pause(); }
    else { widget.play(); watchPlayback(); }
  });
  previous.addEventListener('click', () => change(-1));
  next.addEventListener('click', () => change(1));
  shuffleToggle.addEventListener('click', () => {
    shuffle = !shuffle; bag = []; history = [current]; historyPosition = 0;
    shuffleToggle.setAttribute('aria-pressed', String(shuffle));
    shuffleToggle.title = `Shuffle ${shuffle ? 'on' : 'off'}`;
    status.textContent = shuffle ? 'Shuffle on. Every track plays before the order repeats.' : 'Shuffle off. Tracks play in station order.';
    busy(loading);
  });
  volume.addEventListener('input', () => widget?.setVolume(Number(volume.value)));
  seek.addEventListener('change', () => {
    if (!widget || !duration) return;
    seekTarget = Number(seek.value) / 1000 * duration; seekTime = performance.now();
    widget.seekTo(seekTarget);
  });
  busy(false);
}
