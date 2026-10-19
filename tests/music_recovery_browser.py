"""Missing progress notifications, reset-before-finish and recoverable errors."""
import ast
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT=Path(__file__).resolve().parents[1]
tree=ast.parse((ROOT/'tests/site_browser.py').read_text(encoding='utf-8'))
FIXTURE=next(ast.literal_eval(n.value) for n in tree.body if isinstance(n,ast.Assign) and any(isinstance(t,ast.Name) and t.id=='WIDGET_FIXTURE' for t in n.targets))
FIXTURE=FIXTURE.replace('testAudio.emit=emit;', 'testAudio.player=player;testAudio.emit=emit;')


async def main():
    async with async_playwright() as p:
        browser=await p.chromium.launch(executable_path=str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        page=await browser.new_page()
        await page.route('**/api/visits',lambda r:r.fulfill(json={'visits':123}))
        await page.route('https://w.soundcloud.com/player/**',lambda r:r.fulfill(body='<html>Fixture</html>',content_type='text/html'))
        await page.route('https://wave.sndcdn.com/**',lambda r:r.fulfill(json={'height':100,'samples':[10,90,20,80]*450},headers={'Access-Control-Allow-Origin':'*'}))
        await page.route('https://i1.sndcdn.com/test-cover.png',lambda r:r.fulfill(path=str(ROOT/'assets/plan/portrait-original.png'),content_type='image/png'))
        await page.goto('http://127.0.0.1:49280/',wait_until='networkidle')
        await page.evaluate(FIXTURE)
        await page.locator('#music-play').click()
        await page.wait_for_function("document.querySelector('.dap').dataset.playing==='true'")
        await page.wait_for_function("!document.getElementById('music-cover').hidden")
        # Audio position keeps moving without PLAY_PROGRESS notifications.
        await page.evaluate('testAudio.position=25000')
        await page.wait_for_function("document.getElementById('music-time').textContent==='0:25'")
        await page.evaluate("testAudio.emit('progress',{soundId:999999,currentPosition:80000})")
        assert await page.locator('#music-time').inner_text()=='0:25'
        # A transient error must not remove a playing engine or cover.
        await page.evaluate("testAudio.emit('error');testAudio.position=28000")
        await page.wait_for_timeout(1700)
        assert await page.locator('.soundcloud-engine').count()==1
        assert await page.locator('#music-cover').is_visible()
        assert await page.evaluate('testAudio.loads.length')==0
        # A genuine stalled engine gets one reload and resumes at its saved position.
        await page.evaluate("testAudio.emit('error')")
        await page.wait_for_function('testAudio.loads.length===1')
        await page.wait_for_function("document.querySelector('.dap').dataset.playing==='true'&&!document.getElementById('music-next').disabled")
        assert await page.evaluate('testAudio.position')==28000
        await page.evaluate("testAudio.emit('error')")
        await page.wait_for_function("document.getElementById('music-state').textContent==='Interrupted'")
        assert await page.evaluate('testAudio.loads.length')==1,'Recovery must not loop'
        await page.locator('#music-play').click()
        await page.wait_for_function('testAudio.loads.length===2')
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        await page.locator('#music-play').click()
        await page.evaluate("testAudio.emit('error')")
        await page.wait_for_timeout(1700)
        assert await page.evaluate('testAudio.loads.length')==2,'Explicit pause must not auto-resume'
        await page.locator('#music-play').click()
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        loads=await page.evaluate('testAudio.loads.length')
        await page.evaluate("testAudio.emit('progress',{currentPosition:132500});testAudio.emit('progress',{currentPosition:0});testAudio.emit('finish');testAudio.emit('finish')")
        await page.wait_for_function(f'testAudio.loads.length==={loads+1}')
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        assert await page.evaluate('testAudio.loads.length')==loads+1
        # Provider previews may end before the advertised full-track duration.
        loads=await page.evaluate('testAudio.loads.length')
        await page.evaluate("testAudio.emit('progress',{currentPosition:29900});testAudio.emit('progress',{currentPosition:0});testAudio.emit('finish')")
        await page.wait_for_function(f'testAudio.loads.length==={loads+1}')
        await page.wait_for_function("!document.getElementById('music-next').disabled")
        await browser.close()
        print('PASS: real-position polling without progress events, stale-event rejection, transient-error cover retention, bounded reconnection/resume, explicit pause and zero-reset natural track ending.')


asyncio.run(main())
