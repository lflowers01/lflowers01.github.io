---
title: PaintedDesktop
date: '2026-10-04'
status: Released v2.1.0
summary: A Windows tray app that sets a new public-domain oil landscape as your wallpaper every day.
role: Design and development
repo: https://github.com/lflowers01/PaintedDesktop
image: /assets/projects/painted-desktop.jpg
image_alt: A Claude Lorrain landscape as the desktop wallpaper, with PaintedDesktop's history and painting details windows open
---

## The idea

A new oil painting on the Windows desktop every day: landscapes, seascapes and cityscapes from public museum collections, at full resolution and with no text over the image.

## What it does

- Changes the wallpaper at a time you choose, and catches up if the PC was off or asleep.
- Detects the real screen resolution, including high-DPI displays, and downloads each painting at the size the screen needs.
- Never repeats a painting, and can use the same one on the lock screen.
- Lives in the system tray: click to see the painting's title, artist, year and source; right-click for history, settings or a new painting now.

## How it works

Paintings come from three free sources tried in order: the Art Institute of Chicago, the Rijksmuseum and Wikimedia Commons. No accounts or API keys are needed. If the internet is not up yet, it retries with backoff before settling into a 15-minute retry.

It is written in Python, packaged with PyInstaller and installed per user with Inno Setup, so no admin rights are needed. Pushing a version tag runs the tests on GitHub Actions, builds the installer and publishes the release.

## Where it stands

Version 2.1.0 is the latest release, for Windows.
