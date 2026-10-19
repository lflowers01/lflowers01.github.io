"""Full-site browser checks. Music uses a controlled official-widget API fixture."""
import asyncio
import base64
import json
import os
from pathlib import Path
import sys
from playwright.async_api import async_playwright

BASE = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:49280").rstrip("/")
CHROME = Path(os.environ.get("BROWSER_EXECUTABLE") or str(Path(os.environ.get("LOCALAPPDATA", "")) / "ms-playwright/chromium-1248/chrome-win64/chrome.exe"))

ROOT = Path(__file__).resolve().parents[1]
wave_evidence = json.loads((ROOT / "research_notes/soundcloud-waveform-evidence.json").read_text(encoding="utf-8"))
wave_body = next(event["body"]["content"] for event in wave_evidence["normalized_result"]["events"]["items"] if event["kind"] == "network-content")
WAVEFORM = json.loads(base64.b64decode(wave_body))

WIDGET_FIXTURE = """()=>{
  window.testAudio={position:0,volume:0,loads:[],failEarly:false};
  function Widget(){
    const handlers={},emit=(event,value)=>handlers[event]?.(value);
    const player={bind:(e,fn)=>{handlers[e]=fn},unbind:e=>delete handlers[e],
      isPaused:fn=>fn(false),setVolume:v=>testAudio.volume=v,getDuration:fn=>fn(133000),getPosition:fn=>fn(testAudio.position),
      getSounds:fn=>fn(testAudio.imported||[{id:987654,title:'Visitor track',user:{username:'Visitor artist',permalink_url:'https://soundcloud.com/visitor'}}]),
      getCurrentSound:fn=>fn({duration:30000,full_duration:133000,waveform_url:'https://wave.sndcdn.com/test-waveform.json',artwork_url:testAudio.loads.length?null:'https://i1.sndcdn.com/test-cover.png'}),
      play:()=>{emit('play');testAudio.position=testAudio.position||12000;emit('progress',{currentPosition:testAudio.position})},
      pause:()=>emit('pause'),seekTo:v=>testAudio.position=v,
      load:(url,options)=>{testAudio.loads.push(url);testAudio.position=0;setTimeout(options.callback,40)}};
    testAudio.emit=emit;
    setTimeout(()=>emit('ready'),40);return player;
  }
  Widget.Events={READY:'ready',PLAY:'play',PAUSE:'pause',PLAY_PROGRESS:'progress',FINISH:'finish',ERROR:'error'};
  window.SC={Widget};
}"""


async def main():
    async with async_playwright() as playwright:
        options = {"headless": True}
        if CHROME.exists():
            options["executable_path"] = str(CHROME)
        browser = await playwright.chromium.launch(**options)
        print(f"Browser: {browser.version} / {CHROME}", flush=True)
        page = await browser.new_page(viewport={"width":1440,"height":1000}, reduced_motion="reduce")
        errors = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        await page.route("**/api/visits", lambda route: route.fulfill(json={"visits":123}))
        await page.goto(BASE + "/", wait_until="networkidle")
        assert await page.title() == "Lucas Flowers"
        assert await page.locator("#visit-count").inner_text() == "000123"
        assert await page.locator(".dap iframe").count() == 0
        # OLED's pointer glow must be visibly stronger than its resting texture.
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.ambient),stroke=f.ctx.stroke,alphas=[];
          f.ctx.stroke=function(){alphas.push(this.globalAlpha);return stroke.call(this)};
          f.pointer={x:400,y:400};f.pointerTarget=f.pointerStrength=1;f.draw(performance.now());
          const hover=Math.max(...alphas);alphas.length=0;
          f.pointerTarget=f.pointerStrength=0;f.draw(performance.now());
          const rest=Math.max(...alphas);f.ctx.stroke=stroke;f.pointer=null;
          return hover>.20 && rest<.04 && hover>rest*5;
        }""")
        assert await page.locator(".sticky").count() == 3
        await page.evaluate('document.fonts.ready')
        assert await page.evaluate("document.fonts.check('18px Kalam')")
        assert await page.locator('.note-open span').first.evaluate("e=>getComputedStyle(e).lineHeight") == '28px'
        assert 'Kalam' in await page.locator('.note-open strong').first.evaluate("e=>getComputedStyle(e).fontFamily")
        assert await page.locator('main > section').evaluate_all("es=>es.filter(e=>e.id).map(e=>e.id)") == ['about','projects','music','board-section']
        await page.locator('.note-open').first.hover()
        assert await page.locator('.note-open strong').first.evaluate("e=>getComputedStyle(e).textDecorationLine") == 'none'
        assert not await page.get_by_text('Elsewhere on the web').count()
        assert not await page.get_by_text('Reset positions', exact=True).count()
        assert 'Phoenix, Arizona' in await page.locator('.location').first.inner_text()

        # A real pointer drag saves positions, without changing the published text.
        handle = page.locator(".note-handle").first
        await handle.scroll_into_view_if_needed()
        box = await handle.bounding_box()
        await page.mouse.move(box["x"]+30, box["y"]+15)
        await page.mouse.down(); await page.mouse.move(box["x"]+100, box["y"]+45, steps=6); await page.mouse.up()
        saved = await page.evaluate("localStorage.getItem('lf.board.positions.v1')")
        assert saved and "a-place-to-leave-things" in saved
        await page.reload(wait_until="networkidle")
        assert await page.evaluate("localStorage.getItem('lf.board.positions.v1')") == saved
        await page.locator(".note-open").first.click()
        assert "/notes/a-place-to-leave-things.html" in page.url
        assert "at Purdue" in await page.locator(".prose").inner_text()
        await page.go_back(wait_until="networkidle")

        # Pixel ink survives reload; clearing erases ink only. Visitors cannot add notes.
        assert await page.locator('#add-note, #visitor-note-form').count() == 0
        drawing = page.locator('#note-drawing')
        await drawing.scroll_into_view_if_needed()
        box = await drawing.bounding_box()
        await page.mouse.move(box['x']+20, box['y']+box['height']-30)
        await page.mouse.down();await page.mouse.move(box['x']+130,box['y']+box['height']-70,steps=12);await page.mouse.up()
        ink = await page.evaluate("localStorage.getItem('lf.notes.ink.v1')")
        assert ink and len(json.loads(ink)[0]) > 1
        await page.reload(wait_until='networkidle')
        assert await page.evaluate("localStorage.getItem('lf.notes.ink.v1')") == ink
        assert await drawing.evaluate("e=>e.getContext('2d').getImageData(0,0,e.width,e.height).data.some((v,i)=>i%4===3&&v>0)")
        position_before_clear = await page.evaluate("localStorage.getItem('lf.board.positions.v1')")
        await page.evaluate('fields.find(f=>f.spins).objectRotation.yaw=.7')
        await page.locator('#clear-drawing').click()
        assert await page.evaluate('fields.find(f=>f.spins).objectRotation.yaw') == .7
        assert await page.evaluate("JSON.parse(localStorage.getItem('lf.notes.ink.v1')).length") == 0
        # The ink dissolves away and the canvas is empty within a second and a half.
        await page.wait_for_function("!(e=>e.getContext('2d').getImageData(0,0,e.width,e.height).data.some((v,i)=>i%4===3&&v>0))(document.getElementById('note-drawing'))", timeout=1500)
        assert await page.locator('.sticky').count() == 3
        assert await page.evaluate("localStorage.getItem('lf.board.positions.v1')") == position_before_clear

        # Theme survives reading-page navigation and reload, without losing its button label.
        await page.locator("#theme-toggle").click()
        await page.wait_for_function("document.body.dataset.theme==='forest'")
        await page.wait_for_function("!document.documentElement.classList.contains('theme-switching')")
        await page.goto(BASE + "/about.html", wait_until="networkidle")
        assert await page.locator("body").get_attribute("data-theme") == "forest"
        assert await page.locator("#theme-toggle").get_attribute("aria-label") == "Switch to OLED black"
        assert await page.locator('.flower-icon').first.evaluate("e=>getComputedStyle(e).mixBlendMode") == 'screen'
        assert await page.locator('.flower-trigger').first.evaluate("e=>getComputedStyle(e).backgroundColor") == 'rgb(23, 54, 41)'
        flower = page.locator('[data-flower]').first
        await flower.hover()
        await page.wait_for_function("document.querySelector('[data-flower]').src.startsWith('blob:')")
        await page.mouse.move(2, 2)
        await page.wait_for_timeout(200)
        assert (await flower.get_attribute("src")).startswith("blob:")
        await page.wait_for_function("!document.querySelector('[data-flower]').src.startsWith('blob:')")

        for path in ["/notes/", "/projects/", "/projects/academic-dashboard.html", "/colophon.html", "/404.html"]:
            await page.goto(BASE+path, wait_until="networkidle")
            assert await page.locator("h1").count() == 1, path
        response = await page.goto(BASE+"/missing-page", wait_until="networkidle")
        assert response.status == 404 and "Nothing here" in await page.locator("h1").inner_text()

        await page.goto(BASE+"/", wait_until="networkidle")
        await page.locator("#theme-toggle").click()
        await page.wait_for_function("document.body.dataset.theme==='oled' && !document.documentElement.classList.contains('theme-switching')")
        for width in [2559,1920,1440,768,706,700,600,390,320]:
            await page.set_viewport_size({"width":width,"height":1000})
            await page.wait_for_timeout(150)
            assert not await page.evaluate("document.documentElement.scrollWidth>innerWidth"), width
            assert await page.locator('.ipod-shell').evaluate("e=>Math.abs(e.offsetHeight/e.offsetWidth-41/24)<.01"), width
            assert await page.locator('.dap-screen').evaluate("e=>Math.abs(e.offsetWidth/e.offsetHeight-5/4)<.03"), width
            assert await page.locator("#hero-art").evaluate("e=>{const r=e.getBoundingClientRect();return Math.abs(r.left)<1 && Math.abs(r.right-innerWidth)<1}"), width
            if width <= 700:
                assert await page.evaluate("()=>{const f=fields.find(f=>f.spins),g=f.objectGeometry;return g.cy-g.size*1.1>f.copyBottom+15 && g.cy+g.size*1.1<f.height}"), width
            for image in await page.locator(".photo-drawer img").all():
                await image.scroll_into_view_if_needed()
                await image.evaluate("e=>e.decode()")
                assert await image.evaluate("e=>e.naturalWidth>0")
            if width in (1440,390):
                await page.screenshot(path=f".git/site-{width}.png", full_page=True)
        # Actual glyph draw calls fade around contact text, while the rest stays visible.
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.spins),ctx=f.ctx,draw=ctx.fillText,calls=[];
          const canvas=f.canvas.getBoundingClientRect(),r=document.querySelector('.profile-links a').getBoundingClientRect();
          ctx.fillText=function(text,x,y){calls.push({x,y,alpha:this.globalAlpha});return draw.call(this,text,x,y)};
          try{f.draw(performance.now())}finally{ctx.fillText=draw}
          const behind=calls.filter(p=>p.x>r.left-canvas.left&&p.x<r.right-canvas.left&&p.y>r.top-canvas.top&&p.y<r.bottom-canvas.top);
          return behind.length>0&&behind.every(p=>p.alpha<.02)&&calls.some(p=>p.alpha>.2);
        }""")

        # Production integration: portrait click/re-click/hide and the footer's bounded reveal.
        await page.set_viewport_size({"width":1440,"height":1000})
        photo=page.locator('#photo-reveal')
        await photo.click()
        await page.wait_for_function("document.querySelector('#photo-reveal').dataset.reveal==='visible'")
        await photo.click()
        assert await photo.get_attribute('data-reveal') == 'visible'
        await page.mouse.move(2,2)
        await page.wait_for_function("document.querySelector('#photo-reveal').dataset.reveal==='dither'",timeout=5000)
        footer=page.locator('#footer-art')
        await footer.scroll_into_view_if_needed()
        box=await footer.bounding_box()
        await page.mouse.move(box['x']+box['width']/2,box['y']+140)
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.footer),ctx=f.ctx,draw=ctx.fillText,calls=[];
          ctx.fillText=function(text,x,y){if(this.fillStyle==='#ffffff')calls.push({x,y});return draw.call(this,text,x,y)};
          try{f.draw(performance.now())}finally{ctx.fillText=draw}
          return calls.length>0&&calls.every(p=>Math.hypot(p.x-f.pointer.x,p.y-f.pointer.y)<105);
        }""")

        # The published notebook remains readable with JavaScript disabled.
        plain = await browser.new_page(java_script_enabled=False, viewport={"width":390,"height":900})
        await plain.goto(BASE+"/")
        assert await plain.locator(".note-open").count() == 3
        assert await plain.locator("#note-board").is_hidden()  # phones get the plain list instead
        await plain.locator(".note-list a").first.click()
        assert await plain.locator(".prose p").count() > 0
        await plain.close()

        # Adapter check, not a claim of real SoundCloud playback.
        await page.set_viewport_size({"width":1440,"height":1000})
        await page.route("https://w.soundcloud.com/player/**", lambda route: route.fulfill(content_type="text/html", body="<html><body>Widget fixture</body></html>"))
        waveform_requests=[]
        async def waveform_response(route):
            waveform_requests.append(route.request.url)
            if len(waveform_requests)==1:
                await route.fulfill(status=503,body='Temporary CDN failure')
            else:
                await route.fulfill(json=WAVEFORM,headers={"Access-Control-Allow-Origin":"*"})
        await page.route("https://wave.sndcdn.com/**", waveform_response)
        await page.route('https://i1.sndcdn.com/test-cover.png', lambda route: route.fulfill(path=str(ROOT/'assets/plan/portrait-original.png'),content_type='image/png'))
        await page.evaluate(WIDGET_FIXTURE)
        await page.locator("#music-play").click()
        await page.wait_for_function("document.querySelector('.dap').dataset.playing==='true'")
        assert await page.locator("#music-time").inner_text() == "0:12"
        assert await page.locator("#music-duration").inner_text() == "2:13"
        assert await page.locator('.shuffle-strike').evaluate("e=>getComputedStyle(e).display") != 'none'
        await page.wait_for_function("[...document.querySelectorAll('.dap-meter i')].every(e=>parseFloat(e.style.height)>=3) && new Set([...document.querySelectorAll('.dap-meter i')].map(e=>e.style.height)).size>1")
        assert len(waveform_requests)>=2, 'Temporary waveform failures must retry'
        before_bars = await page.locator('.dap-meter i').evaluate_all('(es)=>es.map(e=>e.style.height)')
        await page.locator('#music-select').click()
        assert await page.locator('.dap').get_attribute('data-scrubbing') == 'true'
        await page.locator('#music-select').click()
        assert await page.locator('.dap').get_attribute('data-scrubbing') == 'false'
        assert await page.evaluate('audioTarget') > 0
        await page.wait_for_function("!document.getElementById('music-cover').hidden")
        assert await page.locator('#music-cover').evaluate("e=>e.width===40 && getComputedStyle(e).imageRendering==='pixelated'")
        await page.wait_for_timeout(500)
        assert await page.evaluate("""()=>{const f=fields.find(f=>f.music);return f.ctx.getImageData(0,0,f.canvas.width,f.canvas.height).data.some((v,i)=>i%4===3&&v>30)}"""), 'Reduced-motion mode must retain the waveform background'

        await page.emulate_media(reduced_motion="no-preference")
        await page.locator('#music').scroll_into_view_if_needed()
        await page.wait_for_timeout(1200)
        assert await page.evaluate("""()=>{const f=fields.find(f=>f.music);return f.ctx.getImageData(0,0,f.canvas.width,f.canvas.height).data.some((v,i)=>i%4===3&&v>0)}""")
        # The background is the real mirrored waveform, with fixed character cells.
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.music),ctx=f.ctx,draw=ctx.fillText,calls=[];
          ctx.fillText=function(text,x,y){calls.push({text,x,y});return draw.call(this,text,x,y)};
          try{f.draw(performance.now())}finally{ctx.fillText=draw}
          return musicWaveform.samples.length===1800&&calls.length>100&&
            calls.some(p=>p.y<f.playerY-15)&&calls.some(p=>p.y>f.playerY+15)&&
            calls.every(p=>(p.x-4)%7===0&&(p.y-4)%9===0);
        }"""), 'Background must render the captured waveform on a fixed ASCII grid'
        # Real pointer input turns the local trace into X dither and emits fixed-grid ripples.
        field=page.locator('#music-art')
        bounds=await field.bounding_box()
        baseline=await page.evaluate('fields.find(f=>f.music).playerY')
        await page.mouse.move(bounds['x']+100,bounds['y']+baseline)
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.music),ctx=f.ctx,stroke=ctx.stroke;let count=0;
          ctx.stroke=function(){count++;return stroke.call(this)};
          try{f.draw(performance.now())}finally{ctx.stroke=stroke}
          return f.pointer&&count>0;
        }"""), 'Waveform hover must render X dithering'
        await field.click(position={'x':100,'y':baseline})
        assert await page.evaluate("fields.find(f=>f.music).events.at(-1).type==='wave'")
        assert await page.evaluate("""()=>{
          const f=fields.find(f=>f.music),event=f.events.at(-1),pointer=f.pointer;
          f.pointer=null;f.draw(event.time+180);const first=f.canvas.toDataURL();
          f.draw(event.time+700);const second=f.canvas.toDataURL();f.pointer=pointer;
          return first!==second;
        }"""), 'Click ripple must propagate through the waveform'
        await page.mouse.move(2,2)
        await page.locator('#music').screenshot(path='.git/music-waveform.png')
        await page.emulate_media(reduced_motion="reduce")
        await page.evaluate("testAudio.emit('progress',{currentPosition:132999})")
        after_bars = await page.locator('.dap-meter i').evaluate_all('(es)=>es.map(e=>e.style.height)')
        assert before_bars != after_bars
        assert sum(float(h[:-2]) for h in after_bars) < sum(float(h[:-2]) for h in before_bars)
        assert await page.locator('.dap-meter i').first.evaluate("e=>getComputedStyle(e).animationName") == 'none'
        assert await page.locator(".soundcloud-engine").get_attribute("allow") == "autoplay; encrypted-media"
        assert await page.locator(".soundcloud-engine").evaluate("e=>e.getBoundingClientRect().width") < 2
        await page.locator("#music-play").click()
        assert await page.locator(".dap").get_attribute("data-playing") == "false"
        assert await page.evaluate('audioTarget') == 0
        frozen = await page.locator('.dap-meter i').evaluate_all('(es)=>es.map(e=>e.style.height)')
        await page.wait_for_timeout(150)
        assert await page.locator('.dap-meter i').evaluate_all('(es)=>es.map(e=>e.style.height)') == frozen
        await page.locator('#music-play').click()
        assert await page.locator('.dap').get_attribute('data-playing') == 'true'
        await page.locator("#music-next").click()
        await page.wait_for_function("document.getElementById('music-title').textContent==='11'")
        await page.locator('#music-next').wait_for(state='visible')
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert await page.locator("#music-index").inner_text() == "02 / 49"
        assert await page.locator('#music-cover').is_hidden()
        await page.locator('#music-menu').click()
        assert await page.locator('#music-main-menu').is_visible()
        await page.locator('[data-ipod-view="settings"]').click()
        assert await page.locator('#music-menu').get_attribute('aria-expanded') == 'true'
        assert await page.locator('#music-settings').is_visible()
        await page.locator('#music-shuffle').press('Escape')
        assert await page.locator('#music-settings').is_hidden()
        assert await page.locator('#music-main-menu').is_visible()
        await page.locator('[data-ipod-view="settings"]').click()
        await page.locator("#music-volume").fill("35")
        assert await page.evaluate("testAudio.volume") == 35
        await page.locator('#music-menu').click()
        await page.locator('#music-menu').click()
        await page.locator("#music-seek").fill("500")
        assert await page.evaluate("testAudio.position") == 66500
        before_seek_index=await page.locator('#music-index').inner_text()
        before_seek_loads=await page.evaluate('testAudio.loads.length')
        await page.evaluate("testAudio.emit('progress',{currentPosition:133000});testAudio.emit('finish')")
        assert await page.locator('#music-index').inner_text() == before_seek_index
        assert await page.evaluate('testAudio.loads.length') == before_seek_loads

        loads = await page.evaluate('testAudio.loads.length')
        await page.locator('#music-next').dblclick()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert await page.evaluate('testAudio.loads.length') == loads + 1

        # Shuffle uses a full bag, previous follows history, and toggling off restores order.
        await page.locator('#music-menu').click()
        await page.locator('[data-ipod-view="settings"]').click()
        await page.locator('#music-shuffle').press('Space')
        assert await page.locator('#music-shuffle').get_attribute('aria-pressed') == 'true'
        assert await page.locator('.shuffle-strike').evaluate("e=>getComputedStyle(e).display") == 'none'
        assert await page.locator('#music-prev').is_disabled()
        sequence = [int((await page.locator('#music-index').inner_text()).split('/')[0])]
        for _ in range(48):
            await page.locator('#music-next').click()
            await page.wait_for_function("!document.getElementById('music-next').disabled")
            sequence.append(int((await page.locator('#music-index').inner_text()).split('/')[0]))
        assert len(set(sequence)) == 49, sequence
        await page.locator('#music-next').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        new_cycle = int((await page.locator('#music-index').inner_text()).split('/')[0])
        assert new_cycle != sequence[-1]
        await page.locator('#music-prev').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert int((await page.locator('#music-index').inner_text()).split('/')[0]) == sequence[-1]
        await page.locator('#music-next').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert int((await page.locator('#music-index').inner_text()).split('/')[0]) == new_cycle
        await page.locator('#music-shuffle').click()
        await page.locator('#music-next').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert int((await page.locator('#music-index').inner_text()).split('/')[0]) == new_cycle % 49 + 1
        # The original-style menu, center selection and rotary wheel actually work.
        await page.locator('#music-menu').click()
        await page.locator('#music-backlight').click()
        assert await page.locator('.dap').get_attribute('data-backlight') == 'false'
        await page.locator('#music-backlight').click()
        await page.locator('[data-ipod-view="songs"]').click()
        assert await page.locator('#music-track-list button').count() == 49
        await page.locator('.ipod-wheel').focus()
        await page.locator('.ipod-wheel').press('ArrowDown')
        assert await page.locator('#music-track-list .ipod-selected').inner_text() == '11'
        await page.locator('#music-select').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert await page.locator('#music-index').inner_text() == '02 / 49'
        # Circular drag on the ring changes volume without changing tracks.
        before_volume=await page.evaluate('testAudio.volume')
        box=await page.locator('.ipod-wheel').bounding_box()
        cx,cy=box['x']+box['width']/2,box['y']+box['height']/2
        import math
        radius=box['width']*.42
        await page.mouse.move(cx+radius*math.cos(-.7),cy+radius*math.sin(-.7))
        await page.mouse.down()
        for angle in [-.5,-.3,-.1,.1,.3,.5]:
            await page.mouse.move(cx+radius*math.cos(angle),cy+radius*math.sin(angle))
        await page.mouse.up()
        assert await page.evaluate('testAudio.volume') > before_volume

        # A visitor can load a public SoundCloud selection without changing site defaults.
        await page.locator('#music-menu').click()
        await page.locator('[data-ipod-view="link"]').click()
        await page.locator('#music-url').fill('https://soundcloud.com.evil.example/track')
        previous_loads=await page.evaluate('testAudio.loads.length')
        await page.locator('#music-load').click()
        assert 'public SoundCloud' in await page.locator('#music-link-status').inner_text()
        assert await page.evaluate('testAudio.loads.length') == previous_loads
        await page.locator('#music-url').fill('https://soundcloud.com/visitor/sets/test')
        await page.locator('#music-load').click()
        await page.wait_for_function("document.getElementById('music-title').textContent==='Visitor track'")
        assert await page.locator('#music-index').inner_text() == '01 / 01'
        assert await page.locator('.music-source').get_attribute('href') == 'https://soundcloud.com/visitor/sets/test'
        assert await page.locator('#music-track-list button').count() == 1
        assert await page.locator('#music-shuffle').is_disabled()
        await page.locator('#music-menu').click()
        await page.locator('[data-ipod-view="link"]').click()
        await page.locator('#music-default').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert await page.locator('#music-index').inner_text() == '01 / 49'
        assert await page.locator('#music-track-list button').count() == 49

        # A confirmed natural end still advances once, while an early finish never loops.
        await page.evaluate("testAudio.emit('progress',{currentPosition:133000});testAudio.emit('finish')")
        await page.wait_for_function("document.getElementById('music-index').textContent==='02 / 49'&&!document.getElementById('music-next').disabled")
        # A track that fails before advancing must not automatically cycle through the playlist.
        before_index = await page.locator('#music-index').inner_text()
        await page.evaluate("testAudio.emit('progress',{currentPosition:0});testAudio.emit('finish')")
        assert await page.locator('#music-state').inner_text() == 'Unavailable'
        assert await page.locator('#music-index').inner_text() == before_index
        assert await page.locator('.soundcloud-engine').count() == 0
        assert not await page.locator('#music-play').is_disabled()

        # Blocking the remote SDK leaves a working retry button and source link.
        await page.goto(BASE+'/', wait_until='networkidle')
        await page.route('https://w.soundcloud.com/player/api.js', lambda route: route.abort())
        await page.locator('#music-play').click()
        await page.wait_for_function("document.getElementById('music-state').textContent==='Unavailable'")
        assert not await page.locator('#music-play').is_disabled()
        assert await page.locator('.music-source').get_attribute('href')

        # Failure is explicit; no bogus zero or browser-only visit total.
        await page.route("**/api/visits", lambda route: route.fulfill(status=503,json={"error":"Unavailable"}))
        await page.goto(BASE+"/", wait_until="networkidle")
        assert await page.locator("#visit-count").inner_text() == "Unavailable"
        assert not errors, errors
        await browser.close()
        print("PASS: full-site links/content, real note dragging and persistence, theme continuity, nine viewport widths, text clearance, loaded photos, no-JS notes, counter failure state, custom music controls/rapid skips, REA waveform loud/quiet/pause behavior, shuffle without repeats/history/sequential restoration and failed-track/blocked-SDK recovery; no JS errors. Audible playback was confirmed separately by the owner.")


asyncio.run(main())
