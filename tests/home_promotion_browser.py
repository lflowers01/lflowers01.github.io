"""Approved homepage promotion: previews fit images, main state survives, single hero remains."""
import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

ROOT = Path(__file__).resolve().parents[1]
BASE = 'http://127.0.0.1:49280'

async def main():
    async with async_playwright() as pw:
        browser = await pw.chromium.launch(executable_path=str(ROOT / '.local/chrome-for-testing/chrome-win64/chrome.exe'))
        page = await browser.new_page(viewport={'width': 1440, 'height': 1000}, reduced_motion='reduce')
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        await page.route('**/api/visits', lambda route: route.fulfill(json={'visits': 123}))
        await page.add_init_script("localStorage.setItem('desk.items.v1',JSON.stringify({ipod:{x:.3,y:.5}}));localStorage.setItem('study.desk.items.v1',JSON.stringify({ipod:{x:.8,y:.7}}))")
        for path in ['/', '/home-study.html']:
            await page.goto(BASE + path)
            await page.evaluate('document.fonts.ready')
            await page.locator('#projects').scroll_into_view_if_needed()
            await page.locator('.project-visual img').first.evaluate('(img)=>img.decode()')
            for width in [320, 390, 768, 1440]:
                await page.set_viewport_size({'width': width, 'height': 1000})
                for theme in ['oled', 'forest']:
                    await page.evaluate('(theme)=>{document.body.dataset.theme=theme;dispatchEvent(new Event("resize"))}', theme)
                    await page.wait_for_timeout(150)
                    assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (path,width,theme)
                    for image in await page.locator('.project-visual img').all():
                        await image.evaluate('(img)=>img.decode()')
                        size = await image.evaluate('img=>({w:img.clientWidth,h:img.clientHeight,nw:img.naturalWidth,nh:img.naturalHeight,box:img.parentElement.clientHeight})')
                        assert abs(size['h']-size['w']*size['nh']/size['nw']) < 2, (path,width,size)
                        assert abs(size['box']-size['h']) < 2, (path,width,size)
            await page.set_viewport_size({'width':1440,'height':1000})
            await page.locator('.project-card').nth(1).focus()
            assert await page.locator('.project-card').nth(1).evaluate('e=>e.classList.contains("is-selected")')
            await page.locator('#projects').screenshot(path=str(ROOT / ('.git/promoted-projects.png' if path=='/' else '.git/study-projects-fit.png')))
            if path == '/':
                assert await page.evaluate('fields.find(f=>f.spins).multiForm===false')
                assert await page.locator('.study-banner').count() == 0
                assert await page.locator('body').get_attribute('data-home') == 'true'
                assert await page.evaluate('JSON.parse(localStorage.getItem("desk.items.v1")).ipod.x') == .3
                await page.locator('[data-desk-handle]').focus()
                await page.keyboard.press('ArrowRight')
                assert await page.evaluate('JSON.parse(localStorage.getItem("desk.items.v1")).ipod.x') > .3
                assert await page.evaluate('JSON.parse(localStorage.getItem("study.desk.items.v1")).ipod.x') == .8
            print(path, 'both themes, 320/390/768/1440px, natural image bounds and preview focus passed', flush=True)
        assert not errors, errors
        await browser.close()

asyncio.run(main())
