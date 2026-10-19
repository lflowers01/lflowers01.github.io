"""Run against the local preview: python tests/preview_interactions.py [base URL]."""
import asyncio
import os
from pathlib import Path
import sys
from playwright.async_api import async_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:49278").rstrip("/")
CHROME = Path(os.environ.get("LOCALAPPDATA", "")) / "ms-playwright/chromium-1248/chrome-win64/chrome.exe"


async def main():
    async with async_playwright() as playwright:
        options = {"headless": True}
        if CHROME.exists():
            options["executable_path"] = str(CHROME)
        browser = await playwright.chromium.launch(**options)
        page = await browser.new_page(viewport={"width": 1440, "height": 1000}, reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        await page.goto(BASE + "/design-demo.html?draft=7", wait_until="networkidle")
        await page.evaluate("document.fonts.ready")

        # A real drag rotates the object on two axes without translating it.
        hero = page.locator("#hero-art")
        geometry = await page.evaluate("({cx:fields.find(f=>f.spins).objectGeometry.cx,cy:fields.find(f=>f.spins).objectGeometry.cy})")
        bounds = await hero.bounding_box()
        await page.mouse.move(bounds["x"] + geometry["cx"], bounds["y"] + geometry["cy"])
        await page.mouse.down()
        await page.mouse.move(bounds["x"] + geometry["cx"] - 90, bounds["y"] + geometry["cy"] + 35, steps=10)
        await page.mouse.up()
        await page.wait_for_timeout(120)
        moved = await page.evaluate("({cx:fields.find(f=>f.spins).objectGeometry.cx,cy:fields.find(f=>f.spins).objectGeometry.cy})")
        assert abs(moved["cx"] - geometry["cx"]) < 1, moved
        assert abs(moved["cy"] - geometry["cy"]) < 1, moved
        rotation = await page.evaluate("fields.find(f=>f.spins).objectRotation")
        assert abs(rotation['yaw'] + .81) < .02 and abs(rotation['pitch'] - .315) < .02, rotation
        assert await page.evaluate("fields.find(f=>f.spins).marks.size") == 0
        await page.locator("#clear-drawing").click()

        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.spins),oldMode=renderMode,oldPointer=f.pointer;
          f.pointer=null;renderMode='hybrid';f.draw(1000);const resting=f.canvas.toDataURL();
          renderMode='ascii';f.draw(1000);const ascii=f.canvas.toDataURL();
          renderMode='hybrid';f.pointer={x:f.objectGeometry.cx+80,y:f.objectGeometry.cy};f.draw(1000);
          const lens=f.canvas.toDataURL();renderMode=oldMode;f.pointer=oldPointer;
          return resting===ascii&&lens!==ascii;
        }"""), "ASCII must be the resting material and X dithering the lens"

        # Background has a resting texture and changes even without a pointer.
        await page.mouse.move(0, 0)
        ambient = page.locator("#ambient-art")
        assert await ambient.evaluate("e=>e.getContext('2d').getImageData(0,0,e.width,e.height).data.some((v,i)=>i%4===3&&v>0)")
        before = await ambient.evaluate("e=>e.toDataURL()")
        await page.wait_for_timeout(500)
        assert before != await ambient.evaluate("e=>e.toDataURL()")

        # Pointer response must also fade out completely at the header bottom.
        await page.locator(".site-header nav a").first.hover()
        await page.wait_for_timeout(450)
        strength = await page.evaluate("fields.find(f=>f.spins).pointerStrength")
        assert strength > .8
        await page.mouse.move(500, 500)
        immediate = await page.evaluate("fields.find(f=>f.spins).pointerStrength")
        assert immediate > .4, immediate
        await page.wait_for_timeout(500)
        assert await page.evaluate("fields.find(f=>f.spins).pointerStrength") < immediate * .15
        assert await page.locator("#hero-art").evaluate("""e=>{
          const c=e.getContext('2d'),ratio=e.height/e.getBoundingClientRect().height,nav=document.querySelector('.site-header').offsetHeight;
          const top=Math.ceil(nav*.84*ratio),bottom=Math.floor(nav*ratio);
          return !c.getImageData(0,top,e.width,bottom-top).data.some((v,i)=>i%4===3&&v>15);
        }""")

        await page.locator("[data-render=ascii]").click()
        hero = page.locator("#hero-art")
        await hero.click(position={"x": 1000, "y": 300})
        # Isolate the wave from the rotating object to verify propagation and
        # capture actual drawing calls to check the fixed character lattice.
        radii = await page.evaluate("""()=>{
          const f=fields.find(f=>f.spins),original=f.objectField;
          const event=f.events.at(-1),ctx=f.ctx,fillText=ctx.fillText;
          if(event.type!=='wave') throw new Error('Hero click did not emit a wave');
          f.objectField=(_,cell)=>({cols:Math.ceil(f.width/cell),light:new Float32Array(Math.ceil(f.width/cell)*Math.ceil(f.height/cell))});
          const radii=[];
          try {
            for(const age of [160,500,900]) {
              const points=[];
              ctx.fillText=function(text,x,y){if(this.globalAlpha>.1&&y>document.querySelector('.site-header').offsetHeight+8)points.push([x,y]);return fillText.call(this,text,x,y)};
              f.draw(event.time+age);
              if(!points.length) throw new Error('Ripple produced no visible ASCII');
              for(const [x,y] of points) if(Math.abs((x-3.5)/7-Math.round((x-3.5)/7))>1e-6 || Math.abs((y-3.5)/7-Math.round((y-3.5)/7))>1e-6) throw new Error('Ripple moved a character off the grid');
              radii.push(Math.max(...points.map(([x,y])=>Math.hypot(x-event.x,y-event.y))));
            }
          } finally {ctx.fillText=fillText;f.objectField=original}
          return radii;
        }""")
        assert radii[1] > radii[0] + 40 and radii[2] > radii[1] + 40, radii

        # The heading must keep the same color and geometry on hover.
        heading = page.locator("#board-title")
        await heading.scroll_into_view_if_needed()
        before = await heading.evaluate("e=>({color:getComputedStyle(e).color,x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width})")
        await heading.hover()
        assert before == await heading.evaluate("e=>({color:getComputedStyle(e).color,x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width})")
        assert await heading.evaluate("e=>getComputedStyle(e).textShadow") == "none"

        # A real click must visibly progress, including with reduced motion.
        photo = page.locator("#photo-reveal")
        await photo.click()
        await page.wait_for_timeout(180)
        early = await photo.evaluate("e=>e.toDataURL()")
        assert await photo.get_attribute("data-reveal") == "transition"
        await page.wait_for_timeout(380)
        middle = await photo.evaluate("e=>e.toDataURL()")
        assert early != middle
        await page.wait_for_function("document.querySelector('#photo-reveal').dataset.reveal==='visible'")
        assert middle != await photo.evaluate("e=>e.toDataURL()")
        assert await photo.evaluate("""e=>{
          const d=e.getContext('2d').getImageData(0,0,260,300).data;
          let equalPairs=0,differentNextPair=0;
          for(let y=40;y<240;y+=2)for(let x=40;x<220;x+=2){
            const i=(y*260+x)*4;
            if(d[i]===d[i+4]&&d[i+1]===d[i+5]&&d[i+2]===d[i+6])equalPairs++;
            if(d[i]!==d[i+8]||d[i+1]!==d[i+9]||d[i+2]!==d[i+10])differentNextPair++;
          }
          return equalPairs===9000 && differentNextPair>1000;
        }""")
        revealed = await photo.evaluate("e=>e.toDataURL()")
        await photo.click()
        await page.wait_for_timeout(150)
        assert await photo.get_attribute("data-reveal") == "visible"
        assert await photo.evaluate("e=>e.toDataURL()") == revealed, "Second click restarted the reveal"
        await page.mouse.move(2, 2)
        await page.wait_for_function("document.querySelector('#photo-reveal').dataset.reveal==='dither'", timeout=5000)

        # Moving off the flower must not interrupt its playback.
        flower = page.locator(".name-mark img")
        await page.locator(".name-mark").hover()
        await page.wait_for_function("document.querySelector('.name-mark img').src.startsWith('blob:')")
        playback = await flower.get_attribute("src")
        await page.mouse.move(500, 25)
        await page.wait_for_timeout(200)
        assert await flower.get_attribute("src") == playback
        await page.wait_for_timeout(1100)
        assert (await flower.get_attribute("src")).endswith("flower-original.png")

        # Palette switching animates the whole viewport, even in this preview's
        # reduced-motion mode, and the switch graphic uses pixel paths.
        assert await page.locator("#theme-toggle circle").count() == 0
        await page.locator("#theme-toggle").click()
        await page.wait_for_function("document.body.dataset.theme==='forest'")
        assert await page.evaluate("document.documentElement.classList.contains('theme-switching') || document.body.classList.contains('theme-flash')")
        await page.wait_for_function("!document.documentElement.classList.contains('theme-switching') && !document.body.classList.contains('theme-flash')")

        # Only cells inside the pointer circle reveal the hidden character.
        await page.locator("#end").scroll_into_view_if_needed()
        await page.mouse.move(2, 2)
        await page.wait_for_timeout(800)
        capture = """()=>{
          const f=fields.find(f=>f.footer),ctx=f.ctx,draw=ctx.fillText,calls=[];
          ctx.fillText=function(text,x,y){if(this.fillStyle==='#ffffff')calls.push({text,x,y});return draw.call(this,text,x,y)};
          try{f.draw(performance.now())}finally{ctx.fillText=draw}
          return calls;
        }"""
        assert not await page.evaluate(capture)
        footer = page.locator("#footer-art")
        box = await footer.bounding_box()
        px, py = box["width"] / 2, 140
        await page.screenshot(path=".git/secret-footer-hidden.png")
        await page.mouse.move(box["x"] + px, box["y"] + py)
        await page.wait_for_timeout(180)
        calls = await page.evaluate(capture)
        assert calls and all((c["x"]-px)**2+(c["y"]-py)**2 < 105**2 for c in calls), calls
        await page.screenshot(path=".git/secret-footer-lens.png")
        await page.mouse.move(2, 2)
        await page.wait_for_timeout(180)
        assert not await page.evaluate(capture)
        await footer.focus()
        await page.wait_for_timeout(180)
        calls = await page.evaluate(capture)
        assert calls and all((c["x"]-px)**2+(c["y"]-py)**2 < 105**2 for c in calls)
        await page.emulate_media(reduced_motion="no-preference")
        assert await page.evaluate("getComputedStyle(document.documentElement).scrollBehavior") == "smooth"

        for width in [2559, 1920, 1440, 768, 390, 320]:
            await page.set_viewport_size({"width": width, "height": 900})
            await page.wait_for_timeout(100)
            assert not await page.evaluate("document.documentElement.scrollWidth>innerWidth"), width
            assert await hero.evaluate("e=>{const r=e.getBoundingClientRect();return Math.abs(r.left)<1 && Math.abs(r.right-innerWidth)<1}"), width
        assert not errors, errors
        print("PASS: two-axis torus rotation without translation, reversed pointer lens, breathing background, complete navigation fade and pointer fade-out, outward fixed-grid ripple, stable heading hover, progressive 2px portrait reveal/hide and repeat-click stability, completed flower playback after pointer exit, pixel theme icon and whole-page transition, integrated WALL-E, responsive widths; no JS errors.")
        await browser.close()


asyncio.run(main())
