# SoundCloud waveform / DAP verification

Checked October 19, 2026, using REA with the isolated official Chrome for Testing 155.0.8059.84 executable. The owner separately confirmed audible playback in their regular browser.

## What REA observed

- Direct waveform capture: `ev_8f45e6b519b8fdda396b04b8f349627c7cdf1fec7e6ecd4b3283f8faa3c03d3a`. REA navigated to `https://wave.sndcdn.com/OUIOg0QhA40M_m.json`, waited 300 ms, and retained the response body and DOM. HTTP 200; JSON contains `width: 1800`, `height: 140`, and 1800 amplitude samples. Body SHA-256 `1e88de5c4e8272e24a093452e3dfbdc4f9d8b7a57a014a095a1e1ceb30cf1f8b`. [Complete returned evidence](soundcloud-waveform-evidence.json).
- Player capture: `ev_572fa97d857d60420a9e3c398668bc580133b10b0a9b89cfe5763b2126b2c512`. REA loaded the built homepage, clicked `#music-play`, and waited three seconds. The capture contains the same waveform URL both as an XHR and a fetch, with 200 responses. [Selected extract](soundcloud-player-waveform-extract.json). This establishes that the integrated page actually requests the data, not merely that a URL exists in source. These records do not expose initiator stacks, so request causality is inferred from the implementation and action sequence.
- Both controlled scenarios reported `terminated-owned-process` cleanup. They used empty temporary storage and captured no credential/header values. The direct waveform response is public numeric data. REA warns that response-body bytes are Playwright API results, not verified wire bytes.

## Implementation

SoundCloud's official widget supplies the current sound's `waveform_url` and duration. The DAP fetches the corresponding public JSON after explicit playback begins, normalizes samples by `height`, and uses the actual playback position to select neighboring amplitude samples for the twelve pixel bars. Pausing holds the bars still; seeking moves their position; changing tracks aborts the old waveform request. Missing or malformed waveform data leaves a quiet display and does not interrupt audio. A preview whose duration does not match the full-track waveform is not rendered with a misleading scale.

This is a moving amplitude envelope from the actual track waveform. It is **not a live FFT/frequency spectrum**, which the cross-origin widget does not expose. No audio is downloaded, decrypted, copied or rehosted. The fake CSS equalizer loop has been removed.

The browser tests use the exact REA-captured sample data with a controlled playback-position fixture to verify loud/quiet levels, seeking, and stable pause behavior. That controlled check establishes renderer behavior, not audible playback. Real sound was confirmed by the owner; the test browser lacks the DRM support needed for these protected tracks.


## Track-specific duration fix — October 19

Live inspection of four public tracks in an isolated Chrome profile found that a full song can report `duration:30000` while `full_duration:207000` and Widget `getDuration:207000` agree on the actual timeline. Comparing only the preview duration incorrectly suppressed its waveform. The player now compares `full_duration` when available, falling back to `duration`. All four inspected tracks produced 1,800 valid waveform samples after the fix; a normal public SoundCloud single-track URL also imported successfully through the official Widget API. Exact public observations are in `soundcloud-duration-evidence.json`. This is metadata/network verification, not a claim of audible playback.

The background is now a mirrored ASCII trace around the playhead. Hover switches the local material to X dithering, and clicks add fixed-grid brightness ripples. Meter heights scale to the actual LCD meter area so loud samples do not all hit the same CSS height cap. A bounded retry handles temporary CDN failures or stale metadata. Chrome regression checks include the preview/full-duration case and an initial HTTP 503 followed by a valid waveform.

Seeking commits when the scrubber interaction finishes. A recent seek into the middle cannot trigger automatic next-track navigation; natural completion must be near the verified track end. Tests exercise a false finish after a halfway seek and a genuine end that advances once.
