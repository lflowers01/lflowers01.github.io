"""Alternate homepage layout and storage isolation; no external services needed."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]


async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=str(ROOT / '.local/chrome-for-testing/chrome-win64/chrome.exe'), headless=True)
        errors = []
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.route('**/api/visits', lambda route: route.fulfill(json={'visits': 123}))
        await page.goto('http://127.0.0.1:49280/home-study.html')
        await page.evaluate('document.fonts.ready')
        await page.wait_for_timeout(800)
        main_keys = {'desk.items.v1': {'ipod': {'x': .8, 'y': .7}}, 'lf.photos.layout.v1': {'0': {'x': .2, 'y': .1}}, 'desk.lf.notes.ink.v1': []}
        await page.evaluate('(keys) => { for (const [k,v] of Object.entries(keys)) localStorage.setItem(k,JSON.stringify(v)) }', main_keys)
        cards = page.locator('.study-project-list .project-card')
        assert await cards.count() == 2
        await cards.nth(1).focus()
        assert 'is-selected' in (await cards.nth(1).get_attribute('class'))
        await cards.nth(0).hover()
        assert 'is-selected' in (await cards.nth(0).get_attribute('class'))
        await page.locator('.photo-open').first.click()
        assert await page.locator('.photo-focus').evaluate('(e)=>e.open')
        await page.keyboard.press('Escape')
        assert not await page.locator('.photo-focus').evaluate('(e)=>e.open')
        await page.locator('[data-desk-handle]').focus()
        await page.keyboard.press('ArrowRight')
        assert await page.evaluate('localStorage.getItem("study.desk.items.v1") !== null')
        await page.locator('.photo-drawer figure').first.focus()
        await page.keyboard.press('ArrowRight')
        assert await page.evaluate('localStorage.getItem("study.lf.photos.layout.v1") !== null')
        for width in [360, 390, 768, 1440]:
            await page.set_viewport_size({'width': width, 'height': 1000})
            for theme in ['oled', 'forest']:
                await page.evaluate('(theme)=>{document.body.dataset.theme=theme;window.dispatchEvent(new Event("resize"))}', theme)
                await page.wait_for_timeout(300)
                assert await page.evaluate('document.documentElement.scrollWidth <= innerWidth'), f'Overflow: {width} {theme}'
                # A fresh layout is checked separately; this page has intentionally moved objects.
                await page.screenshot(path=str(ROOT / f'.git/home-study-{width}-{theme}.png'), full_page=True)
                print(f'{width}px {theme}: fits viewport', flush=True)
        actual = await page.evaluate('(keys)=>Object.fromEntries(Object.keys(keys).map(k=>[k,JSON.parse(localStorage.getItem(k))]))', main_keys)
        assert actual == main_keys, 'Experiment changed homepage storage'
        fresh = await browser.new_page(viewport={'width': 390, 'height': 844}, is_mobile=True, has_touch=True)
        await fresh.goto('http://127.0.0.1:49280/home-study.html')
        await fresh.evaluate('document.fonts.ready')
        await fresh.wait_for_timeout(700)
        heading = await fresh.locator('.desk-heading').bounding_box()
        player = await fresh.locator('.desk-player').bounding_box()
        note = await fresh.locator('.sticky').bounding_box()
        assert player['y'] >= heading['y'] + heading['height'], 'Player under toolbar'
        assert note['y'] >= player['y'] + player['height'], 'Default note overlaps player'
        await fresh.locator('#draw-mode').tap()
        assert await fresh.locator('#note-drawing').get_attribute('data-touch-drawing') == 'true'
        await fresh.close()
        assert not errors, errors
        assert 'home-study.html' not in (ROOT / 'dist/sitemap.xml').read_text()
        print('Preview, photo dialog, isolated storage, touch controls and default desk spacing passed.')
        await browser.close()


asyncio.run(main())
