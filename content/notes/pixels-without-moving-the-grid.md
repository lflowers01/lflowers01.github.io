---
draft: true
title: Rendering on a fixed grid
date: '2026-10-18'
x: 0.85
y: 0.16
summary: How the ASCII torus, pointer lens, and water ripple share one grid.
---

The hero starts as ASCII. Moving the pointer over it turns a small circle into X dithering. Clicking sends a ripple through the field.

One detail I wanted to get right: the ripple shouldn't knock the characters out of their grid. It changes their brightness and density instead. The grid stays still while the wave passes through it.

Dragging the center rotates the inner torus. The outer ring keeps a slower rotation, with a smaller response to the drag. It's a little object to play with, rather than just a background.
