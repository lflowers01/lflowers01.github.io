# Fourth-generation iPod reference

Chosen model: Apple's July 2004 A1059 iPod (Click Wheel), the monochrome device in the owner's reference image. This replaces the earlier loosely proportioned portable-player shell.

## Primary sources

- [Apple technical specifications](https://support.apple.com/en-ae/112541): body height 4.1 inches, width 2.4 inches; 160×128 LCD. CSS therefore uses `aspect-ratio:24/41` for the body and `5/4` for the screen.
- [Apple model identification](https://support.apple.com/en-us/103823): fourth generation has the integrated Click Wheel. Third generation instead has four separate buttons above its touch wheel.
- [Apple's fourth-generation reference photograph](https://cdsassets.apple.com/live/7WUAS350/images/ipod/ipod-classic/ipod-clickwheel-hold-switch.png): inspected directly for front-panel proportions, wheel/button placement and highlighted list appearance.
- [Original Click Wheel User's Guide](https://cdsassets.apple.com/live/6GJYWVAV/user/ma520_ipod_click_wheel_userguide.pdf), pages 13–16: Menu moves back, Select chooses a row, wheel rotation navigates or changes volume, Select on Now Playing switches to seeking, and the bottom button plays/pauses. The site implements these core interactions.
- [SoundCloud Widget API](https://developers.soundcloud.com/docs/api/html5-widget): official playback controls, asynchronous `getSounds` and `getCurrentSound` metadata, and playback progress events used by the custom interface.

## Reconstruction

The case has fixed hardware proportions, independent of song titles, status or credits. Attribution is outside the shell. Relative placements estimated from Apple's photograph: LCD at 6% from top, 15.8% from left, 68.4% of body width; wheel at 48.5% from top, 70% of body width; center button 32% of wheel diameter. These placement values are visual estimates, not published mechanical drawings. The body's overall ratio and LCD ratio come from the official specifications.

The main menu keeps the reference's list structure: Music, Extras, Settings, SoundCloud Link, Backlight. The fourth row deliberately replaces the original Shuffle Songs row; shuffle is available in Settings. Music opens the selected tracks; Extras provides Now Playing and the source link; Settings provides volume and shuffle; Backlight changes LCD brightness. Circular pointer drag and arrow keys operate the wheel. All visible controls have real behavior; there are no placeholder menus.

SoundCloud Link accepts a public standard SoundCloud track or playlist URL. It asks the official widget for up to 500 validated sounds, falling back to the current sound for a single track. This is a visitor's current-page selection, not a site configuration change; Default station restores the 49-track snapshot. SoundCloud controls which public links can be embedded and played.

Site-specific adaptations: charcoal/green instead of white/blue, Departure Mono instead of Apple's bitmap font, a 40×40 current-track cover tinted into the LCD, and a waveform meter. Original monochrome A1059 hardware did not display album art; the cover is retained because the owner explicitly requested it. The SoundCloud engine and platform restrictions are unchanged.

The background follows the owner's later waveform reference: a mirrored, grainy horizontal trace made from ASCII. It uses actual captured SoundCloud amplitude samples around the playhead. The base scene does not emit periodic water rings or use simulated FFT bars. A local X-dither hover lens and outward click brightness ripple provide the same pointer language as the hero, while characters remain on their grid.

Some SoundCloud sound objects report a 30-second preview in `duration` while `full_duration` and the widget's playback duration describe the full song. Visual loading uses `full_duration || duration` for its duration check, with two bounded retries for transient fetch failures or stale metadata. A missing waveform stays quiet without stopping audio; this is amplitude-envelope playback, not live audio analysis.
