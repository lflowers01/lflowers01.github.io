"""Mobile routes, touch scrolling/drawing/dragging and phone-sized controls."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def swipe(cdp, x, y, dx, dy):
    await cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
    for step in range(1, 11):
        await cdp.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':x+dx*step/10,'y':y+dy*step/10}]})
        await asyncio.sleep(.025)
    await cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]})


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        page = await browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=2,reduced_motion='reduce')
        errors=[]
        page.on('pageerror',lambda e: errors.append(str(e)))
        await page.route('**/api/visits',lambda r:r.fulfill(json={'visits':123}))
        routes=['/'+str(path.relative_to(ROOT/'dist')).replace('\\','/') for path in (ROOT/'dist').rglob('*.html') if path.name not in ['classic.html','desk-demo.html']]
        for width in [320,390,844]:
            await page.set_viewport_size({'width':width,'height':390 if width==844 else 844})
            for route in routes:
                await page.goto('http://127.0.0.1:49280'+route,wait_until='domcontentloaded')
                await page.evaluate('document.fonts.ready')
                await page.wait_for_timeout(100)
                assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth'),(width,route)
        await page.set_viewport_size({'width':390,'height':844})
        await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
        assert await page.locator('.profile-links + .hero-webring').is_visible()
        assert await page.locator('.hero-webring .ring-step').evaluate_all('es=>es.every(e=>{const r=e.getBoundingClientRect();return r.width>=44&&r.height>=44&&!e.hasAttribute("target")})')
        assert await page.locator('.sticky').count()==1
        assert await page.locator('.note-open strong').inner_text()=='More ideas soon'
        assert await page.locator('.note-open').evaluate('e=>getComputedStyle(e).filter')=='none'
        assert 'Kalam' in await page.locator('.note-open strong').evaluate('e=>getComputedStyle(e).fontFamily')
        assert await page.locator('.handwriting-bitmap').count()==1
        assert await page.locator('.handwriting-bitmap').evaluate('e=>e.width<=e.clientWidth/1.5+1&&getComputedStyle(e).imageRendering==="pixelated"')
        assert await page.locator('.handwriting-bitmap').evaluate('''e=>{
          const d=e.getContext('2d').getImageData(0,0,e.width,e.height).data, scale=e.clientHeight/e.height;
          let ink=false;
          for(let y=0;y<e.height;y++)for(let x=0;x<e.width;x++)if(d[(y*e.width+x)*4+3]){
            ink=true;if(y*scale<1||(y+1)*scale>27)return false;
          }
          return ink;
        }'''), 'Handwriting must stay between the first pair of paper rules'
        cdp=await page.context.new_cdp_session(page)
        await page.evaluate("scrollTo({top:document.getElementById('note-board').getBoundingClientRect().top+scrollY+300,behavior:'instant'})")
        await page.wait_for_timeout(100)
        x=await page.locator('#note-board').evaluate('e=>e.getBoundingClientRect().left+20')
        before=await page.evaluate('scrollY')
        await swipe(cdp,x,500,0,-150)
        await page.wait_for_timeout(200)
        assert await page.evaluate('scrollY') > before+50, 'Desk must allow normal finger scrolling'
        assert await page.evaluate("localStorage.getItem('desk.lf.notes.ink.v1')") is None
        assert await page.locator('#draw-mode').get_attribute('aria-pressed') == 'false'
        await page.locator('#draw-mode').tap()
        assert await page.locator('#touch-drawing span').inner_text() == 'Done'
        assert await page.locator('#draw-mode').get_attribute('aria-pressed') == 'true'
        await page.evaluate("scrollTo({top:document.getElementById('note-board').getBoundingClientRect().top+scrollY+300,behavior:'instant'})")
        await page.wait_for_timeout(100)
        before=await page.evaluate('scrollY')
        await swipe(cdp,x,500,50,-100)
        assert abs(await page.evaluate('scrollY')-before)<2
        assert await page.evaluate("JSON.parse(localStorage.getItem('desk.lf.notes.ink.v1'))[0].length>2")
        await page.locator('#touch-drawing').tap()
        await page.wait_for_function("document.querySelector('#touch-drawing span').textContent==='Draw'")
        assert await page.locator('#touch-drawing span').inner_text() == 'Draw'
        assert await page.locator('#draw-mode').get_attribute('aria-pressed') == 'false'
        for mode in ['sand-toggle','life-mode']:
            await page.locator('#'+mode).tap()
            assert await page.locator('#touch-drawing').get_attribute('aria-pressed') == 'true'
            assert await page.locator('#'+mode).get_attribute('aria-pressed') == 'true'
            await page.locator('#touch-drawing').tap()
        await page.locator('#draw-mode').tap()
        for selector in ['.note-handle','[data-desk-handle]']:
            handle=page.locator(selector).first
            await handle.scroll_into_view_if_needed()
            box=await handle.bounding_box()
            await swipe(cdp,box['x']+box['width']/2,box['y']+box['height']/2,25,25)
        assert await page.evaluate("localStorage.getItem('desk.items.v1')&&localStorage.getItem('desk.lf.board.positions.v1')")
        await page.locator('#music-menu').tap()
        await page.locator('[data-ipod-view=settings]').tap()
        assert await page.locator('#music-settings').is_visible()
        await page.locator('.photo-open').first.tap()
        assert await page.locator('.photo-focus').is_visible()
        await page.locator('.photo-focus-close').tap()
        assert not await page.locator('.photo-focus').is_visible()
        badge=page.locator('#site-badge')
        await page.emulate_media(reduced_motion='no-preference')
        await badge.tap()
        assert await badge.locator('.site-badge-turn').evaluate('''e=>{
          const animation=e.getAnimations()[0];if(!animation)return false;
          animation.pause();animation.currentTime=80;
          const threeD=getComputedStyle(e).transform.startsWith('matrix3d(');
          animation.play();return threeD;
        }''')
        await badge.tap()
        await page.wait_for_function("document.getElementById('site-badge').getAttribute('aria-pressed')==='true'&&!document.getElementById('site-badge').classList.contains('is-turning')")
        assert await badge.locator('img').is_hidden()
        assert await badge.locator('.site-badge-back').is_visible()
        assert await badge.locator('.site-badge-back').evaluate('e=>getComputedStyle(e).transform')=='none'
        assert await badge.locator('.site-badge-turn').evaluate('e=>getComputedStyle(e).transform')=='none'
        await badge.press('Space')
        await page.wait_for_function("document.getElementById('site-badge').getAttribute('aria-pressed')==='false'&&!document.getElementById('site-badge').classList.contains('is-turning')")
        assert await badge.locator('img').is_visible()
        assert await badge.locator('.site-badge-back').is_hidden()
        await page.emulate_media(reduced_motion='reduce')
        await badge.tap()
        assert await badge.locator('.site-badge-turn').evaluate('e=>e.getAnimations().length===1')
        await page.wait_for_function("document.getElementById('site-badge').getAttribute('aria-pressed')==='true'&&!document.getElementById('site-badge').classList.contains('is-turning')")
        assert await badge.locator('.site-badge-back').is_visible()
        await badge.tap()
        await page.wait_for_function("document.getElementById('site-badge').getAttribute('aria-pressed')==='false'&&!document.getElementById('site-badge').classList.contains('is-turning')")
        await badge.screenshot(path=str(ROOT/'.git/mobile-badge-fixed.png'))
        for width in [320,360,390,430,768,844]:
            await page.set_viewport_size({'width':width,'height':844})
            assert await page.locator('.site-header').evaluate('e=>{const es=[...e.querySelectorAll("a,button")];return es.every(el=>{const r=el.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44})}'),width
            assert await page.locator('.note-tools').evaluate('e=>e.getBoundingClientRect().right<=innerWidth'),width
        await page.set_viewport_size({'width':390,'height':844})
        await page.locator('.desk-heading').screenshot(path=str(ROOT/'.git/mobile-controls.png'))
        assert not errors,errors
        await browser.close()
        print('PASS: all mobile routes, portrait/landscape, touch scrolling and drawing, note/iPod drag, photo close, menus and larger touch targets; no JS errors.')


asyncio.run(main())
