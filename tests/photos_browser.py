"""Random photo pool, real pointer dragging, persistence and responsive bounds."""
import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(executable_path=os.environ.get('BROWSER_EXECUTABLE') or str(ROOT/'.local/chrome-for-testing/chrome-win64/chrome.exe'))
        context = await browser.new_context(viewport={'width':1440,'height':1000})
        page = await context.new_page()
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        await page.route('**/api/visits', lambda r: r.fulfill(json={'visits':123}))
        await page.add_init_script('Math.random=()=>0')
        await page.goto('http://127.0.0.1:49280/', wait_until='networkidle')
        frames = page.locator('.photo-drawer figure')
        selected = await frames.evaluate_all('es=>es.map(e=>e.dataset.photo)')
        assert len(selected) == len(set(selected)) == 3
        pool = await page.locator('#photo-data').text_content()
        expected = {p.name for p in (ROOT/'assets/photos').iterdir() if p.suffix.lower() in {'.jpg','.jpeg','.png','.webp'}}
        assert {p['id'] for p in json.loads(pool)} == expected
        # Every restored image really decodes; the viewport always shows only three prints.
        assert await page.evaluate('''async()=>{for(const p of JSON.parse(document.getElementById('photo-data').textContent)){
          const i=new Image();i.src=p.src;await i.decode();if(!i.naturalWidth)return false;
        }return true}''')
        for image in await frames.locator('img').all():
            assert await image.evaluate('e=>Math.abs(e.clientWidth/e.clientHeight-.75)<.01')
        centers = await frames.evaluate_all('es=>es.map(e=>e.offsetLeft+e.offsetWidth/2)')
        assert abs((centers[1]-centers[0])-(centers[2]-centers[1])) < 2
        assert await frames.evaluate_all('es=>new Set(es.map(e=>e.offsetTop)).size') == 1
        photo = frames.first
        await photo.scroll_into_view_if_needed()
        before = await photo.bounding_box()
        await page.mouse.move(before['x']+before['width']/2, before['y']+80)
        await page.mouse.down()
        await page.mouse.move(before['x']+before['width']/2+70, before['y']+110, steps=10)
        await page.mouse.up()
        assert page.url == 'http://127.0.0.1:49280/'
        assert not await page.locator('.photo-focus').is_visible()
        saved = await page.evaluate("localStorage.getItem('lf.photos.layout.v1')")
        assert '0' in json.loads(saved)
        assert float((await photo.evaluate('e=>getComputedStyle(e).translate')).split('px')[0]) > 20
        await page.reload(wait_until='networkidle')
        assert await frames.evaluate_all('es=>es.map(e=>e.dataset.photo)') == selected
        assert await page.evaluate("localStorage.getItem('lf.photos.layout.v1')") == saved
        await photo.focus()
        await photo.press('ArrowRight')
        assert await page.evaluate("localStorage.getItem('lf.photos.layout.v1')") != saved
        for width in [1920,768,390,320]:
            await page.set_viewport_size({'width':width,'height':1000})
            await page.wait_for_timeout(120)
            assert not await page.evaluate('document.documentElement.scrollWidth>innerWidth'), width
            assert await photo.evaluate('e=>{const p=e.parentElement;return e.offsetLeft+parseFloat(getComputedStyle(e).translate)>=0&&e.offsetLeft+parseFloat(getComputedStyle(e).translate)+e.offsetWidth<=p.clientWidth+1}')
        # A separate, deterministically different shuffle picks a different group.
        other = await page.context.new_page()
        await other.add_init_script('Math.random=()=>.999999')
        await other.route('**/api/visits', lambda r: r.fulfill(json={'visits':123}))
        await other.goto('http://127.0.0.1:49280/', wait_until='networkidle')
        assert await other.locator('.photo-drawer figure').evaluate_all('es=>es.map(e=>e.dataset.photo)') != selected
        assert await other.evaluate("localStorage.getItem('lf.photos.layout.v1')") == await page.evaluate("localStorage.getItem('lf.photos.layout.v1')")
        assert await other.locator('.photo-drawer figure').first.evaluate("e=>getComputedStyle(e).translate") != 'none'
        layout = json.loads(await other.evaluate("localStorage.getItem('lf.photos.layout.v1')"))
        actual = await other.locator('.photo-drawer figure').first.evaluate("e=>{const p=e.parentElement;return {x:(e.offsetLeft+parseFloat(getComputedStyle(e).translate)-12)/(p.clientWidth-e.offsetWidth-24),y:(e.offsetTop+parseFloat(getComputedStyle(e).translate.split(' ')[1])-12)/(p.clientHeight-e.offsetHeight-24)}}")
        assert abs(actual['x']-layout['0']['x']) < .002 and abs(actual['y']-layout['0']['y']) < .002

        # Clicking focuses the original in place; Escape, X and keyboard activation work.
        await page.set_viewport_size({'width':1440,'height':1000})
        src = await photo.locator('img').get_attribute('src')
        await photo.locator('img').click()
        assert page.url == 'http://127.0.0.1:49280/'
        assert await page.locator('.photo-focus').is_visible()
        assert await page.locator('.photo-focus>img').get_attribute('src') == src
        await page.keyboard.press('Escape')
        assert not await page.locator('.photo-focus').is_visible()
        await photo.locator('button').focus()
        await page.keyboard.press('Enter')
        assert await page.locator('.photo-focus').is_visible()
        await page.locator('.photo-focus-close').click()
        assert not await page.locator('.photo-focus').is_visible()
        await photo.locator('button').click()
        await page.keyboard.press('x')
        assert not await page.locator('.photo-focus').is_visible()
        await page.set_viewport_size({'width':390,'height':844})
        await photo.locator('button').click()
        assert await page.locator('.photo-focus').evaluate('e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight}')
        await page.screenshot(path=str(ROOT/'.git/photo-focused-mobile.png'))
        await page.keyboard.press('Escape')
        assert not errors, errors
        plain = await browser.new_page(java_script_enabled=False)
        await plain.goto('http://127.0.0.1:49280/')
        assert await plain.locator('.photo-drawer img').count() == 3
        await browser.close()
        print('PASS: complete folder-derived image pool, three distinct random prints, portrait crops, pointer drag without navigation, saved slot positions across different random photos, even defaults, keyboard movement, responsive bounds and in-place photo focus with Escape/X closing and unchanged URL; no JS errors.')


asyncio.run(main())
